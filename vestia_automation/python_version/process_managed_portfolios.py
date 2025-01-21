from datetime import datetime, timedelta
from airflow import DAG
from airflow.hooks.postgres_hook import PostgresHook
from airflow.operators.python_operator import PythonOperator
import logging
import json

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
    'process_managed_portfolio_trades',
    default_args=default_args,
    description='Process trades for managed portfolio accounts',
    schedule_interval='0 23 * * *',  # Run daily at 23:00 UTC
    catchup=False,
)

def process_managed_portfolio_trades():
    """Process trades for managed portfolio accounts based on cash balance"""
    hook = PostgresHook(postgres_conn_id='my_postgres_conn')
    conn = hook.get_conn()
    cursor = conn.cursor()

    try:
        # Step 1: Get all active managed portfolio accounts with cash balance
        cursor.execute("""
            SELECT 
                a.account_id,
                a.managed_portfolio_id,
                mp.allocation,
                vcb.available_cash_balance,
                vcb.currency_code
            FROM 
                account a
                INNER JOIN managed_portfolio mp ON a.managed_portfolio_id = mp.managed_portfolio_id
                INNER JOIN public.vw_cash_balance vcb ON a.account_id = vcb.account_id
            WHERE 
                mp.managed_portfolio_status = 'Active'
                AND vcb.available_cash_balance > 0;
        """)
        accounts = cursor.fetchall()

        for account in accounts:
            account_id, portfolio_id, allocation_json, cash_balance, currency_code = account
            allocation = json.loads(allocation_json) if isinstance(allocation_json, str) else allocation_json

        # Process each asset in the allocation
        for asset_code, allocation_percentage in allocation.items():
            # Get asset_id from asset_code
            cursor.execute("""
                SELECT a.asset_id, latest_price 
                FROM asset a
                JOIN public.vw_latest_price vlp ON a.asset_id = vlp.asset_id
                WHERE a.asset_code = %s
            """, (asset_code,))
            asset_result = cursor.fetchone()
            
            if not asset_result:
                logger.warning(f"Asset not found for code: {asset_code}")
                continue

            asset_id, latest_price = asset_result
            
            # Calculate allocation amount based on percentage
            allocation_amount = (float(cash_balance) * float(allocation_percentage)) / 100
            
            # Calculate units to buy
            units = allocation_amount / float(latest_price)
            
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
                    date_placed
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING asset_trade_id
            """, (
                account_id,
                asset_id,
                units,
                latest_price,
                'Buy',
                'Pending',
                currency_code,
                datetime.now(),
                datetime.now(),
                datetime.now()
            ))
            
            asset_trade_id = cursor.fetchone()[0]
            
            # Create corresponding cash trade for the asset purchase
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
                -float(allocation_amount),
                currency_code,
                'Pending',
                f'Buy {units:.4f} units of {asset_code}',
                datetime.now(),
                datetime.now(),
                asset_trade_id,
                'Buy'
            ))

        # Commit all changes
        conn.commit()
        logger.info("Managed portfolio trades processed successfully.")

    except Exception as e:
        conn.rollback()
        logger.error(f"An error occurred: {e}")
        raise

    finally:
        cursor.close()
        conn.close()

# Define PythonOperator
process_managed_portfolio_trades_operator = PythonOperator(
    task_id='process_managed_portfolio_trades',
    python_callable=process_managed_portfolio_trades,
    dag=dag,
)

process_managed_portfolio_trades_operator