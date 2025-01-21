from datetime import datetime, timedelta
from airflow import DAG
from airflow.hooks.postgres_hook import PostgresHook
from airflow.operators.python_operator import PythonOperator
import logging

# Default arguments for the DAG
default_args = {
    'owner': 'airflow',
    'start_date': datetime(2025, 1, 16),
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}

# Define the DAG
dag = DAG(
    'process_pending_deposits',
    default_args=default_args,
    description='Process pending deposits and update statuses',
    schedule_interval='0 23 * * *',  # Run daily at 11 PM
    catchup=False,
)

def process_pending_deposits():
    """
    Fetch pending deposits and update their status to 'Completed' 
    with the current timestamp.
    """
    hook = PostgresHook(postgres_conn_id='my_postgres_conn')
    conn = hook.get_conn()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            SELECT 
                cash_trade_id,
                account_id,
                amount,
                currency_code
            FROM 
                cash_trade
            WHERE 
                trade_status = 'Pending'
                AND trade_type = 'Deposit';
        """)
        pending_deposits = cursor.fetchall()

        for deposit in pending_deposits:
            cash_trade_id, account_id, amount, currency_code = deposit

            cursor.execute("""
                UPDATE cash_trade
                SET 
                    trade_status = 'Completed',
                    date_completed = %s,
                    date_updated = %s
                WHERE 
                    cash_trade_id = %s
            """, (
                datetime.now(),
                datetime.now(),
                cash_trade_id
            ))

        conn.commit()
        logging.info("Pending deposits processed successfully.")

    except Exception as e:
        conn.rollback()
        logging.error(f"An error occurred: {e}")
        raise

    finally:
        cursor.close()
        conn.close()

# Define PythonOperator
process_pending_deposits_operator = PythonOperator(
    task_id='process_pending_deposits',
    python_callable=process_pending_deposits,
    dag=dag,
)

process_pending_deposits_operator
