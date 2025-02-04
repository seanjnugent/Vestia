from datetime import datetime, timedelta
from airflow import DAG
from airflow.hooks.postgres_hook import PostgresHook
from airflow.operators.python_operator import PythonOperator
from decimal import Decimal
import logging
import yfinance as yf
import time
from psycopg2.extras import RealDictCursor

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Default arguments for the DAG
default_args = {
    'owner': 'airflow',
    'start_date': datetime(2023, 1, 1),  # Set to a past date
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}

# Define the DAG
dag = DAG(
    'process_pending_sell_trades',
    default_args=default_args,
    description='Process pending Sell trades and update statuses',
    schedule_interval='30 23 * * *',  # Run daily at 23:30 (11:30 PM)
    catchup=False,
)

def get_asset_code(asset_id, cursor):
    """Get the yfinance-compatible asset code"""
    cursor.execute("""
        SELECT asset_code 
        FROM public.asset 
        WHERE asset_id = %s
    """, (asset_id,))
    result = cursor.fetchone()
    return result['asset_code'] if result else None

def get_live_price(asset_id, cursor, retries=3, delay=2):
    """Get real-time price from yfinance with retries and fallback"""
    asset_code = get_asset_code(asset_id, cursor)
    if not asset_code:
        logger.error(f"No asset code found for asset_id {asset_id}")
        return get_view_price(asset_id, cursor)

    for attempt in range(retries):
        try:
            ticker = yf.Ticker(asset_code)

            # Use the history method to get the latest closing price
            history = ticker.history(period="1d")
            if history.empty:
                raise ValueError(f"No historical data found for {asset_code}")

            # Get the latest closing price
            live_price = history['Close'].iloc[-1]

            # Ensure the price is a valid number
            try:
                live_price = Decimal(str(live_price))
            except Exception as e:
                raise ValueError(f"Invalid price format for {asset_code}: {live_price}")

            logger.info(f"Got live price for {asset_code}: {live_price}")

            # Fetch currency code from the database
            cursor.execute("""
                SELECT currency_code
                FROM public.vw_latest_price
                WHERE asset_id = %s
            """, (asset_id,))
            currency_info = cursor.fetchone()

            return {
                'latest_price': live_price,
                'currency_code': currency_info['currency_code'] if currency_info else 'USD'
            }

        except Exception as e:
            logger.warning(f"Attempt {attempt + 1} failed for {asset_code}: {str(e)}")
            if attempt < retries - 1:
                time.sleep(delay)  # Wait before retrying
            else:
                logger.error(f"Failed to fetch live price for {asset_code} after {retries} attempts")
                return get_view_price(asset_id, cursor)

def get_view_price(asset_id, cursor):
    """Fallback to get the latest price from the database view"""
    try:
        cursor.execute("""
            SELECT latest_price, currency_code
            FROM public.vw_latest_price
            WHERE asset_id = %s
        """, (asset_id,))
        result = cursor.fetchone()
        if result:
            return {
                'latest_price': Decimal(str(result['latest_price'])),
                'currency_code': result['currency_code']
            }
        else:
            raise Exception(f"No price found in database for asset_id {asset_id}")
    except Exception as e:
        logger.error(f"Error fetching fallback price: {str(e)}")
        return None

def get_pending_sell_trades(cursor):
    """Get all pending Sell trades from the asset_trade table"""
    cursor.execute("""
        SELECT 
            at.asset_trade_id,
            at.account_id,
            at.asset_id,
            at.quote_units,
            at.quote_price,
            at.trade_mode,
            a.asset_code,
            at.currency_code
        FROM public.asset_trade at
        LEFT JOIN public.asset a ON at.asset_id = a.asset_id
        WHERE at.trade_type = 'Sell'
        AND at.trade_status = 'Pending'
    """)
    trades = cursor.fetchall()
    
    logger.info(f"Found {len(trades)} pending Sell trades")
    for trade in trades:
        logger.info(f"Pending Sell Trade Details: "
                    f"Asset Trade ID: {trade['asset_trade_id']}, "
                    f"Account ID: {trade['account_id']}, "
                    f"Asset ID: {trade['asset_id']}, "
                    f"Trade Mode: {trade['trade_mode']}")
    
    return trades
    
def process_sell_trade(trade, cursor):
    """Process a single Sell trade"""
    try:
        logger.info(f"Processing Sell trade: Asset Trade ID {trade['asset_trade_id']}, "
                    f"Asset ID: {trade['asset_id']}, "
                    f"Trade Mode: {trade['trade_mode']}")

        # Get live price
        price_info = get_live_price(trade['asset_id'], cursor)
        if not price_info:
            raise Exception(f"No price available for asset_id {trade['asset_id']}")

        live_price = Decimal(str(price_info['latest_price']))
        logger.info(f"Live price for asset {trade['asset_id']}: {live_price}")

        # Calculate units to sell
        if trade['trade_mode'] == 'VALUE':
            # Fetch the linked cash_trade record to get the expected sale amount
            cursor.execute("""
                SELECT amount
                FROM public.cash_trade
                WHERE linked_asset_trade_id = %s
            """, (trade['asset_trade_id'],))
            cash_trade = cursor.fetchone()

            if not cash_trade:
                raise Exception(f"No linked cash_trade found for asset_trade_id {trade['asset_trade_id']}")

            expected_amount = abs(Decimal(str(cash_trade['amount'])))
            actual_quantity = (expected_amount / live_price).quantize(Decimal('0.000001'))
        else:
            # Use the specified units directly for UNITS mode
            actual_quantity = abs(Decimal(str(trade['quote_units'])))

        # Check if the account has enough units to sell
        cursor.execute("""
            SELECT asset_holding
            FROM public.vw_asset_balance
            WHERE account_id = %s AND asset_id = %s
        """, (trade['account_id'], trade['asset_id']))
        asset_holding = cursor.fetchone()

        if not asset_holding or asset_holding['asset_holding'] < actual_quantity:
            raise Exception(f"Insufficient units to sell for asset_id {trade['asset_id']}")

        # Calculate proceeds from the sale
        sale_proceeds = (actual_quantity * live_price).quantize(Decimal('0.01'))

        if trade['trade_mode'] == 'VALUE':
            # Update the linked cash_trade with the actual proceeds
            cursor.execute("""
                UPDATE public.cash_trade
                SET amount = %s,
                    trade_status = 'Completed',
                    date_completed = CURRENT_TIMESTAMP,
                    date_updated = CURRENT_TIMESTAMP,
                    trade_note = %s
                WHERE linked_asset_trade_id = %s;
            """, (
                float(sale_proceeds),  # Update with actual proceeds
                f"Proceeds from selling {actual_quantity} units of {trade['asset_code']}",
                trade['asset_trade_id']
            ))
        else:
            # Create a new cash_trade for the sale proceeds (UNITS mode)
            cursor.execute("""
                INSERT INTO public.cash_trade (
                    account_id,
                    amount,
                    currency_code,
                    trade_note,
                    trade_status,
                    linked_asset_trade_id,
                    trade_type,
                    date_created,
                    date_updated
                ) VALUES (
                    %s, %s, %s, %s, %s, %s, %s, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
                )
            """, (
                trade['account_id'],
                float(sale_proceeds),  # Positive amount for sale proceeds
                trade['currency_code'],
                f"Proceeds from selling {actual_quantity} units of {trade['asset_code']}",
                'Completed',
                trade['asset_trade_id'],
                'Sell'
            ))

        # Update the asset_trade to mark it as completed
        cursor.execute("""
            UPDATE public.asset_trade
            SET trade_status = 'Completed',
                filled_price = %s,
                filled_units = %s,
                date_completed = CURRENT_TIMESTAMP,
                date_updated = CURRENT_TIMESTAMP,
                trade_note = %s
            WHERE asset_trade_id = %s;
        """, (
            float(live_price),
            float(-actual_quantity),  # Negative units for sell
            f"Sold {actual_quantity} units of {trade['asset_code']}",
            trade['asset_trade_id']
        ))

        logger.info(f"Successfully processed Sell trade: Asset Trade ID {trade['asset_trade_id']}")

        return {
            'status': 'completed',
            'asset_trade_id': trade['asset_trade_id'],
            'asset_code': trade['asset_code'],
            'filled_units': float(actual_quantity),
            'filled_price': float(live_price),
            'sale_proceeds': float(sale_proceeds)
        }

    except Exception as e:
        logger.error(f"Error processing Sell trade {trade['asset_trade_id']}: {str(e)}")
        raise

def process_all_pending_sell_trades():
    """Process all pending Sell trades"""
    hook = PostgresHook(postgres_conn_id='my_postgres_conn')
    conn = hook.get_conn()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    try:
        pending_sell_trades = get_pending_sell_trades(cursor)
        
        logger.info(f"Total pending Sell trades: {len(pending_sell_trades)}")
        
        results = []
        for trade in pending_sell_trades:
            try:
                result = process_sell_trade(trade, cursor)
                results.append(result)
                conn.commit()
                logger.info(f"Processed Sell trade: {result}")
            except Exception as e:
                logger.error(f"Failed to process Sell trade {trade['asset_trade_id']}: {str(e)}")
                conn.rollback()
                continue

        return results

    except Exception as e:
        logger.error(f"Error in Sell trade processing: {str(e)}")
        conn.rollback()
        raise
    finally:
        cursor.close()
        conn.close()

# Define PythonOperator
process_pending_sell_trades_operator = PythonOperator(
    task_id='process_pending_trades_sell',
    python_callable=process_all_pending_sell_trades,
    dag=dag,
)

process_pending_sell_trades_operator