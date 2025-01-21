from datetime import datetime, timedelta
from airflow import DAG
from airflow.hooks.postgres_hook import PostgresHook
from airflow.operators.python_operator import PythonOperator
import logging
import json
from decimal import Decimal

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Default arguments for the DAG
default_args = {
    'owner': 'airflow',
    'start_date': datetime(2023, 1, 1),
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}

# Define the DAG
dag = DAG(
    'process_portfolio_rebalancing',
    default_args=default_args,
    description='Rebalance managed portfolio accounts',
    schedule_interval='0 22 * * *',  # Run daily at 22:00 UTC
    catchup=False,
)

def calculate_rebalance_trades():
    """Calculate and execute rebalancing trades for managed portfolios"""
    hook = PostgresHook(postgres_conn_id='my_postgres_conn')
    conn = hook.get_conn()
    cursor = conn.cursor()

    try:
        # Get all active managed portfolio accounts with total portfolio value
        cursor.execute("""
            WITH portfolio_values AS (
                SELECT 
                    a.account_id,
                    SUM(vab.asset_value) as total_portfolio_value
                FROM 
                    account a
                    LEFT JOIN public.vw_asset_balance vab ON a.account_id = vab.account_id
                GROUP BY 
                    a.account_id
            )
            SELECT 
                a.account_id,
                a.managed_portfolio_id,
                mp.allocation,
                COALESCE(pv.total_portfolio_value, 0) as total_portfolio_value,
                vcb.available_cash_balance,
                vcb.currency_code
            FROM 
                account a
                INNER JOIN managed_portfolio mp ON a.managed_portfolio_id = mp.managed_portfolio_id
                LEFT JOIN portfolio_values pv ON a.account_id = pv.account_id
                LEFT JOIN public.vw_cash_balance vcb ON a.account_id = vcb.account_id
            WHERE 
                mp.managed_portfolio_status = 'Active'
        """)
        accounts = cursor.fetchall()

        for account in accounts:
            account_id, portfolio_id, target_allocation_json, total_portfolio_value, available_cash, currency_code = account
            target_allocation = json.loads(target_allocation_json) if isinstance(target_allocation_json, str) else target_allocation_json
            
            # Convert to Decimal
            total_portfolio_value = Decimal(str(total_portfolio_value))
            available_cash = Decimal(str(available_cash))

            # Get current asset allocations
            cursor.execute("""
                SELECT 
                    a.asset_code,
                    vab.asset_value,
                    vab.asset_holding,
                    a.asset_id,
                    vlp.latest_price
                FROM 
                    public.vw_asset_balance vab
                    JOIN asset a ON vab.asset_id = a.asset_id
                    JOIN public.vw_latest_price vlp ON a.asset_id = vlp.asset_id
                WHERE 
                    vab.account_id = %s
            """, (account_id,))
            current_holdings = cursor.fetchall()

            # Calculate current vs target allocations
            trades_needed = []
            
            for holding in current_holdings:
                asset_code, asset_value, units, asset_id, latest_price = holding
                
                # Convert to Decimal
                asset_value = Decimal(str(asset_value))
                units = Decimal(str(units))
                latest_price = Decimal(str(latest_price))
                
                current_pct = (asset_value / total_portfolio_value * Decimal('100')) if total_portfolio_value > 0 else Decimal('0')
                target_pct = Decimal(str(target_allocation.get(asset_code, 0)))
                
                difference_pct = target_pct - current_pct
                difference_value = (difference_pct / Decimal('100')) * total_portfolio_value
                
                # If difference is significant (e.g., > 1%)
                if abs(difference_pct) > Decimal('1'):
                    trades_needed.append({
                        'asset_code': asset_code,
                        'asset_id': asset_id,
                        'difference_value': difference_value,
                        'current_units': units,
                        'latest_price': latest_price
                    })

            # Sort trades - sells first, then buys
            sells = [t for t in trades_needed if t['difference_value'] < 0]
            buys = [t for t in trades_needed if t['difference_value'] > 0]

            # Track projected cash balance
            projected_cash = available_cash
            
            # Track all trades to be executed
            trades_to_execute = []

            # Process sells first
            for trade in sells:
                units_to_sell = abs(trade['difference_value'] / trade['latest_price'])
                trade_cash_impact = abs(trade['difference_value'])
                
                trades_to_execute.append({
                    'type': 'sell',
                    'asset_id': trade['asset_id'],
                    'asset_code': trade['asset_code'],
                    'units': units_to_sell,
                    'price': trade['latest_price'],
                    'cash_impact': trade_cash_impact
                })
                
                projected_cash += trade_cash_impact

            # Process buys, but only if we have enough cash
            for trade in buys:
                units_to_buy = trade['difference_value'] / trade['latest_price']
                trade_cash_impact = -trade['difference_value']  # Negative for buys
                
                # Check if we have enough projected cash for this buy
                if (projected_cash + trade_cash_impact) >= Decimal('0'):
                    trades_to_execute.append({
                        'type': 'buy',
                        'asset_id': trade['asset_id'],
                        'asset_code': trade['asset_code'],
                        'units': units_to_buy,
                        'price': trade['latest_price'],
                        'cash_impact': trade_cash_impact
                    })
                    projected_cash += trade_cash_impact
                else:
                    logger.warning(f"Skipping buy trade for {trade['asset_code']} due to insufficient projected cash")

            # Execute all approved trades
            for trade in trades_to_execute:
                # Create asset trade
                cursor.execute("""
                    INSERT INTO asset_trade (
                        account_id,
                        asset_id,
                        quote_units,
                        quote_price,
                        trade_type,
                        trade_status,
                        currency_code,
                        date_created,
                        date_updated,
                        date_placed,
                        trade_note,
                        trade_mode
                    )
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    RETURNING asset_trade_id
                """, (
                    account_id,
                    trade['asset_id'],
                    float(trade['units']),  # Convert Decimal to float for database
                    float(trade['price']),  # Convert Decimal to float for database
                    trade['type'].capitalize(),
                    'Pending',
                    currency_code,
                    datetime.now(),
                    datetime.now(),
                    datetime.now(),
                    f'Rebalancing {trade["type"]} trade',
                    f'Value',
                ))
                
                asset_trade_id = cursor.fetchone()[0]
                
                # Create corresponding cash trade
                cursor.execute("""
                    INSERT INTO cash_trade (
                        account_id,
                        amount,
                        currency_code,
                        trade_status,
                        trade_note,
                        date_created,
                        date_updated,
                        linked_asset_trade_id,
                        trade_type
                    )
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    account_id,
                    float(trade['cash_impact']),  # Convert Decimal to float for database
                    currency_code,
                    'Pending',
                    f'Rebalancing {trade["type"]} of {float(trade["units"]):.4f} units of {trade["asset_code"]}',
                    datetime.now(),
                    datetime.now(),
                    asset_trade_id,
                    trade['type'].capitalize()
                ))

        # Commit all changes
        conn.commit()
        logger.info("Portfolio rebalancing trades processed successfully.")

    except Exception as e:
        conn.rollback()
        logger.error(f"An error occurred: {e}")
        raise

    finally:
        cursor.close()
        conn.close()

# Define PythonOperator
process_rebalancing_operator = PythonOperator(
    task_id='process_portfolio_rebalancing',
    python_callable=calculate_rebalance_trades,
    dag=dag,
)

process_rebalancing_operator