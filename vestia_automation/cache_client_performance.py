from airflow import DAG
from airflow.providers.postgres.hooks.postgres import PostgresHook
from airflow.operators.python_operator import PythonOperator
from airflow.utils.dates import days_ago
from datetime import date, timedelta, datetime
import logging
import pandas as pd
from sqlalchemy import create_engine, text
from sqlalchemy.pool import QueuePool

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Global connection pool
engine = None

def get_db_engine():
    """Retrieve the database engine using Airflow connection."""
    global engine
    if engine is None:
        hook = PostgresHook(postgres_conn_id='my_postgres_conn')
        engine = create_engine(hook.get_uri(), poolclass=QueuePool, pool_size=5, max_overflow=10)
    return engine

def aggregate_client_performance(**kwargs):
    """
    Aggregate account performance data into client performance data.
    Upsert the results into the `client_performance` table.
    """
    engine = get_db_engine()
    start_date = kwargs.get('start_date', date.today() - timedelta(days=1))
    end_date = kwargs.get('end_date', date.today())

    logging.info(f"Aggregating client performance data for period: {start_date} to {end_date}")

    # Query to aggregate account performance data by client
    query = text("""
        SELECT
            b.client_id,
            a.performance_date,
            SUM(a.cash_balance) AS total_cash_balance,
            SUM(a.total_asset_value) AS total_asset_value
        FROM public.account_performance a
        INNER JOIN public.account b ON a.account_id = b.account_id
        WHERE a.performance_date BETWEEN :start_date AND :end_date
        GROUP BY b.client_id, a.performance_date
    """)

    # Fetch aggregated data
    with engine.connect() as conn:
        df = pd.read_sql_query(
            query,
            conn,
            params={"start_date": start_date, "end_date": end_date}
        )

    if df.empty:
        logging.info("No data to aggregate")
        return

    # Upsert into client_performance table
    insert_query = text("""
        INSERT INTO public.client_performance
            (client_id, performance_date, cash_balance, total_asset_value)
        VALUES (:client_id, :performance_date, :cash_balance, :total_asset_value)
        ON CONFLICT (client_id, performance_date)
        DO UPDATE SET
            cash_balance = EXCLUDED.cash_balance,
            total_asset_value = EXCLUDED.total_asset_value
    """)

    records = [
        {
            "client_id": row['client_id'],
            "performance_date": row['performance_date'],
            "cash_balance": float(row['total_cash_balance']),
            "total_asset_value": float(row['total_asset_value'])
        }
        for _, row in df.iterrows()
    ]

    chunk_size = 1000
    with engine.begin() as conn:
        for i in range(0, len(records), chunk_size):
            chunk = records[i:i + chunk_size]
            conn.execute(insert_query, chunk)

    logging.info(f"Aggregated {len(records)} rows into client_performance table")

# Define the DAG
default_args = {
    'owner': 'airflow',
    'start_date': days_ago(1),
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}

dag = DAG(
    'client_performance_aggregation',
    default_args=default_args,
    description='Aggregate account performance data into client performance data',
    schedule_interval='0 2 * * *',  # Run daily at 2 AM
    catchup=False,
)

# Define the task
aggregate_client_performance_task = PythonOperator(
    task_id='aggregate_client_performance',
    python_callable=aggregate_client_performance,
    provide_context=True,
    dag=dag,
)

# Set task dependencies (if there are multiple tasks)
aggregate_client_performance_task