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
    'process_pending_trades',
    default_args=default_args,
    description='Process pending trades and update statuses',
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

def get_pending_trades(cursor):
    """Get all pending trades with separate handling for instruction and manual trades"""
    cursor.execute("""
        SELECT 
            ct.cash_trade_id,
            ct.account_id,
            ct.amount,
            ct.instruction_id,
            ct.asset_trade_id,
            at.asset_id,
            at.target_quantity,
            at.quote_price,
            ctd.instruction_status,
            ctd.instruction_frequency,
            a.asset_code,
            'instruction' as trade_type,
            ctd.instruction_amount as total_instruction_amount,
            ct.cash_trade_note
        FROM public.cash_trade ct
        INNER JOIN public.asset_trade at 
            ON ct.instruction_id = at.instruction_id 
            AND ct.asset_trade_id = at.asset_trade_id
        JOIN (
            SELECT cash_trade_id, a.instruction_id, instruction_status, instruction_frequency, instruction_amount
            FROM public.cash_trade a
            INNER JOIN instruction i ON a.instruction_id = i.instruction_id
            WHERE cash_trade_type = 'Deposit' AND cash_trade_status = 'Completed'
        ) ctd ON ctd.instruction_id = ct.instruction_id and ct.linked_cash_trade_id = ctd.cash_trade_id
        LEFT JOIN public.asset a ON at.asset_id = a.asset_id
        WHERE ct.cash_trade_status = 'Pending'
        AND ct.instruction_id IS NOT NULL
        AND (
            (ct.amount > 0 AND at.asset_id IS NULL) OR
            (ct.amount < 0 AND at.asset_trade_status = 'Pending')
        )
        UNION ALL
        SELECT 
            ct.cash_trade_id,
            ct.account_id,
            ct.amount,
            ct.instruction_id,
            ct.asset_trade_id,
            at.asset_id,
            at.target_quantity,
            at.quote_price,
            NULL as instruction_status,
            NULL as instruction_frequency,
            a.asset_code,
            'manual' as trade_type,
            NULL as total_instruction_amount,
            ct.cash_trade_note
        FROM public.cash_trade ct
        JOIN public.asset_trade at ON ct.asset_trade_id = at.asset_trade_id
        JOIN public.asset a ON at.asset_id = a.asset_id
        WHERE ct.cash_trade_status = 'Pending' 
        AND ct.instruction_id IS NULL
        AND at.asset_trade_status = 'Pending'
    """)
    return cursor.fetchall()

def process_trade(trade, cursor):
    """Process a single trade with consideration for instruction vs manual trades"""
    try:
        # Handle instruction deposit first
        if trade['trade_type'] == 'instruction' and trade['amount'] > 0:
            cursor.execute("""
                UPDATE public.cash_trade
                SET cash_trade_status = 'Completed',
                    date_completed = CURRENT_TIMESTAMP,
                    date_updated = CURRENT_TIMESTAMP
                WHERE cash_trade_id = %s
            """, (trade['cash_trade_id'],))
            
            return {
                'status': 'Completed',
                'trade_type': 'instruction_deposit',
                'cash_trade_id': trade['cash_trade_id'],
                'amount': float(trade['amount'])  # Convert to float
            }

        # For asset trades (both instruction and manual)
        if trade['asset_id']:
            price_info = get_live_price(trade['asset_id'], cursor)
            if not price_info:
                raise Exception(f"No price available for asset_id {trade['asset_id']}")

            live_price = Decimal(str(price_info['latest_price']))
            cash_amount = abs(Decimal(str(trade['amount'])))
            actual_quantity = (cash_amount / live_price).quantize(Decimal('0.000001'))

            # Update asset_trade_note
            asset_trade_note = f"Bought {actual_quantity} assets of {trade['asset_code']}"

            # Update trades
            cursor.execute("""
                UPDATE public.cash_trade
                SET cash_trade_status = 'Completed',
                    date_completed = CURRENT_TIMESTAMP,
                    date_updated = CURRENT_TIMESTAMP,
                    cash_trade_note = %s
                WHERE cash_trade_id = %s;

                UPDATE public.asset_trade
                SET asset_trade_status = 'Completed',
                    filled_price = %s,
                    asset_trade_unit_cost = %s,
                    filled_quantity = %s,
                    asset_trade_quantity = %s,  -- Update asset_trade_quantity
                    date_completed = CURRENT_TIMESTAMP,
                    date_updated = CURRENT_TIMESTAMP,
                    asset_trade_note = %s
                WHERE asset_trade_id = %s;
            """, (
                asset_trade_note,  # Updated cash_trade_note
                trade['cash_trade_id'],
                float(live_price),  # Convert to float
                float(live_price),  # Convert to float
                float(actual_quantity),  # Convert to float
                float(actual_quantity),  # Convert to float
                asset_trade_note,  # Updated asset_trade_note
                trade['asset_trade_id']
            ))

            return {
                'status': 'completed',
                'trade_type': trade['trade_type'],
                'asset_trade_id': trade['asset_trade_id'],
                'cash_trade_id': trade['cash_trade_id'],
                'asset_code': trade['asset_code'],
                'filled_quantity': float(actual_quantity),  # Convert to float
                'filled_price': float(live_price)  # Convert to float
            }

    except Exception as e:
        logger.error(f"Error processing trade {trade['cash_trade_id']}: {str(e)}")
        raise

def process_all_pending_trades():
    """Process all pending trades with improved logging and error handling"""
    hook = PostgresHook(postgres_conn_id='my_postgres_conn')
    conn = hook.get_conn()
    cursor = conn.cursor(cursor_factory=RealDictCursor)  # Use RealDictCursor

    try:
        pending_trades = get_pending_trades(cursor)
        
        instruction_deposits = sum(1 for t in pending_trades 
                                if t['trade_type'] == 'instruction' and t['amount'] > 0)
        instruction_purchases = sum(1 for t in pending_trades 
                                 if t['trade_type'] == 'instruction' and t['amount'] < 0)
        manual_trades = sum(1 for t in pending_trades if t['trade_type'] == 'manual')
        
        logger.info(f"Found {len(pending_trades)} pending trades: "
                   f"{instruction_deposits} instruction deposits, "
                   f"{instruction_purchases} instruction purchases, "
                   f"{manual_trades} manual trades")

        results = []
        for trade in pending_trades:
            try:
                result = process_trade(trade, cursor)
                results.append(result)
                conn.commit()
                logger.info(f"Processed trade: {result}")
            except Exception as e:
                logger.error(f"Failed to process trade {trade['cash_trade_id']}: {str(e)}")
                conn.rollback()
                continue

        return results

    except Exception as e:
        logger.error(f"Error in trade processing: {str(e)}")
        conn.rollback()
        raise
    finally:
        cursor.close()
        conn.close()

# Define PythonOperator
process_pending_trades_operator = PythonOperator(
    task_id='process_pending_trades',
    python_callable=process_all_pending_trades,
    dag=dag,
)

process_pending_trades_operator