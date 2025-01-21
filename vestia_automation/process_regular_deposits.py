from datetime import datetime, timedelta
from airflow import DAG
from airflow.hooks.postgres_hook import PostgresHook
from airflow.operators.python_operator import PythonOperator
from dateutil.relativedelta import relativedelta
import logging

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
    'process_regular_deposits',
    default_args=default_args,
    description='Process regular deposits and update statuses',
    schedule_interval='30 22 * * *',  # Run daily at 22:30 UTC (10:30 PM local time)
    catchup=False,
)

def process_regular_deposits():
    """Process regular deposits and update statuses"""
    hook = PostgresHook(postgres_conn_id='my_postgres_conn')
    conn = hook.get_conn()
    cursor = conn.cursor()

    try:
        # Step 1: Find active regular deposits due today
        cursor.execute("""
            SELECT 
                instruction_id,
                account_id,
                instruction_frequency,
                instruction_amount,
                allocation
            FROM 
                instruction
            WHERE 
                instruction_type = 'RegularDeposit'
                AND instruction_status = 'Active'
                AND next_run_date = CURRENT_DATE;
        """)
        regular_deposits = cursor.fetchall()

        for deposit in regular_deposits:
            instruction_id, account_id, frequency, amount, allocation = deposit
            
            # Step 2: Create pending cash deposit trade
            cursor.execute("""
                INSERT INTO cash_trade (
                    account_id,
                    amount,
                    currency_code,
                    instruction_id,
                    trade_status,
                    trade_note,
                    date_created,
                    date_updated,
                    trade_type
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING cash_trade_id
            """, (
                account_id,
                amount,
                'USD',
                instruction_id,
                'Pending',
                'Regular deposit',
                datetime.now(),
                datetime.now(),
                'Deposit'
            ))
            
            # Capture the cash_trade_id from the initial deposit
            initial_cash_trade_id = cursor.fetchone()[0]
            
            # Step 3: Process each asset allocation
            for asset in allocation:
                asset_id = asset['asset_id']
                allocation_amount = asset['allocation_amount']
                
                # Get latest price for the asset
                cursor.execute("""
                    SELECT latest_price, asset_code 
                    FROM public.vw_latest_price 
                    WHERE asset_id = %s
                """, (asset_id,))
                latest_price = cursor.fetchone()[0]
                
                # Calculate units to buy
                units = float(allocation_amount) / float(latest_price)
                
                # Create pending asset trade
                cursor.execute("""
                    INSERT INTO asset_trade (
                        account_id,
                        asset_id,
                        quote_units,
                        quote_price,
                        trade_type,
                        trade_status,
                        currency_code,
                        instruction_id,
                        date_created,
                        date_updated,
                        date_placed
                    )
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    RETURNING asset_trade_id
                """, (
                    account_id,
                    asset_id,
                    units,
                    latest_price,
                    'Buy',
                    'Pending',
                    'USD',
                    instruction_id,
                    datetime.now(),
                    datetime.now(),
                    datetime.now()
                ))
                
                # Capture the asset_trade_id
                asset_trade_id = cursor.fetchone()[0]
                
                # Create pending cash withdrawal for asset purchase, linking to the asset_trade_id
                cursor.execute("""
                    INSERT INTO cash_trade (
                        account_id,
                        amount,
                        currency_code,
                        instruction_id,
                        trade_status,
                        trade_note,
                        date_created,
                        date_updated,
                        linked_asset_trade_id,
                        linked_cash_trade_id,
                        trade_type
                    )
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    account_id,
                    -float(allocation_amount),
                    'USD',
                    instruction_id,
                    'Pending',
                    f'Buy {allocation_amount:.4f} USD of {asset_id}',
                    datetime.now(),
                    datetime.now(),
                    asset_trade_id,
                    initial_cash_trade_id,
                    'Buy'
                ))
            
            # Step 4: Update next run date based on frequency
            next_run_date = datetime.now()
            if frequency == 'weekly':
                next_run_date += timedelta(weeks=1)
            elif frequency == 'monthly':
                next_run_date += relativedelta(months=1)
            elif frequency == 'yearly':
                next_run_date += relativedelta(years=1)
            
            cursor.execute("""
                UPDATE instruction
                SET 
                    next_run_date = %s,
                    date_updated = %s
                WHERE 
                    instruction_id = %s
            """, (
                next_run_date.date(),
                datetime.now(),
                instruction_id
            ))

        # Commit all changes
        conn.commit()
        logger.info("Regular deposits processed successfully.")

    except Exception as e:
        conn.rollback()
        logger.error(f"An error occurred: {e}")
        raise

    finally:
        cursor.close()
        conn.close()

# Define PythonOperator
process_regular_deposits_operator = PythonOperator(
    task_id='process_regular_deposits',
    python_callable=process_regular_deposits,
    dag=dag,
)

process_regular_deposits_operator