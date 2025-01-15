from airflow import DAG
from airflow.providers.postgres.hooks.postgres import PostgresHook
from airflow.operators.python_operator import PythonOperator
from airflow.utils.dates import days_ago
from datetime import date, timedelta
import logging
from concurrent.futures import ThreadPoolExecutor, as_completed
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

def get_relevant_accounts(start_date, end_date):
    """Get accounts that had activity in the specified date range."""
    engine = get_db_engine()
    query = text("""
        SELECT DISTINCT account_id
        FROM (
            SELECT account_id
            FROM public.cash_trade
            WHERE date_completed::date <= current_date
            AND cash_trade_status = 'Completed'
            UNION
            SELECT account_id
            FROM public.asset_trade
            WHERE date_completed::date <= current_date
        ) combined
        ORDER BY account_id
    """)

    with engine.connect() as conn:
        return [row[0] for row in conn.execute(query)]

def process_account(account_id, start_date, end_date):
    """Process a single account's performance data for the specified date range."""
    engine = get_db_engine()
    query = text("""
        WITH RECURSIVE account_first_activity AS (
            SELECT MIN(first_activity_date) as start_activity_date
            FROM (
                SELECT MIN(date_completed::date) as first_activity_date
                FROM public.cash_trade
                WHERE account_id = :account_id
                AND cash_trade_status = 'Completed'
                UNION
                SELECT MIN(date_completed::date)
                FROM public.asset_trade
                WHERE account_id = :account_id
            ) all_activity
        ),
        date_series AS (
            SELECT
                generate_series(
                    GREATEST(
                        date(:start_date),
                        (SELECT start_activity_date FROM account_first_activity)
                    ),
                    date(:end_date),
                    interval '1 day'
                )::date AS date
        ),
        running_asset_balances AS (
            SELECT
                ds.date,
                at.asset_id,
                SUM(at.asset_trade_quantity) as balance
            FROM date_series ds
            CROSS JOIN (
                SELECT DISTINCT asset_id
                FROM public.asset_trade
                WHERE account_id = :account_id
                AND date_completed::date <= date(:end_date)
            ) assets
            LEFT JOIN public.asset_trade at ON
                at.asset_id = assets.asset_id
                AND at.account_id = :account_id
                AND at.date_completed::date <= ds.date
            GROUP BY ds.date, at.asset_id
            HAVING SUM(at.asset_trade_quantity) != 0
        ),
        daily_prices AS (
            SELECT DISTINCT ON (rab.date, rab.asset_id)
                rab.date,
                rab.asset_id,
                rab.balance,
                COALESCE(ap.amount, (
                    SELECT amount
                    FROM public.asset_price ap2
                    WHERE ap2.asset_id = rab.asset_id
                    AND ap2.price_date <= rab.date
                    ORDER BY price_date DESC
                    LIMIT 1
                )) as price
            FROM running_asset_balances rab
            LEFT JOIN public.asset_price ap ON
                ap.asset_id = rab.asset_id
                AND ap.price_date = rab.date
        ),
        running_cash_balance AS (
            SELECT
                ds.date,
                COALESCE(SUM(ct.amount) FILTER (
                    WHERE ct.date_completed::date <= ds.date
                ), 0) as cash_balance
            FROM date_series ds
            LEFT JOIN public.cash_trade ct ON
                ct.account_id = :account_id
                AND ct.cash_trade_status = 'Completed'
            GROUP BY ds.date
        ),
        daily_totals AS (
            SELECT
                ds.date,
                COALESCE(SUM(dp.balance * dp.price), 0) as total_asset_value,
                rcb.cash_balance
            FROM date_series ds
            LEFT JOIN daily_prices dp ON dp.date = ds.date
            LEFT JOIN running_cash_balance rcb ON rcb.date = ds.date
            GROUP BY ds.date, rcb.cash_balance
            ORDER BY ds.date
        )
        SELECT
            date,
            total_asset_value,
            cash_balance
        FROM daily_totals
        WHERE (total_asset_value != 0 OR cash_balance != 0)
    """)

    with engine.connect() as conn:
        df = pd.read_sql_query(
            query,
            conn,
            params={
                "account_id": account_id,
                "start_date": start_date.strftime('%Y-%m-%d'),
                "end_date": end_date.strftime('%Y-%m-%d')
            }
        )

    if df.empty:
        return account_id, False

    insert_query = text("""
        INSERT INTO public.account_performance
            (account_id, performance_date, total_asset_value, cash_balance)
        VALUES (:account_id, :performance_date, :total_asset_value, :cash_balance)
        ON CONFLICT (account_id, performance_date)
        DO UPDATE SET
            total_asset_value = CASE
                WHEN EXCLUDED.total_asset_value != 0 OR EXCLUDED.cash_balance != 0
                THEN EXCLUDED.total_asset_value
                ELSE account_performance.total_asset_value
            END,
            cash_balance = CASE
                WHEN EXCLUDED.total_asset_value != 0 OR EXCLUDED.cash_balance != 0
                THEN EXCLUDED.cash_balance
                ELSE account_performance.cash_balance
            END
    """)

    df['date'] = pd.to_datetime(df['date']).dt.date
    records = [
        {
            "account_id": account_id,
            "performance_date": row['date'],
            "total_asset_value": float(row['total_asset_value']),
            "cash_balance": float(row['cash_balance'])
        }
        for _, row in df.iterrows()
    ]

    chunk_size = 1000
    with engine.begin() as conn:
        for i in range(0, len(records), chunk_size):
            chunk = records[i:i + chunk_size]
            conn.execute(insert_query, chunk)

    return account_id, True

def fetch_accounts(**kwargs):
    """Fetch relevant account IDs."""
    start_date = kwargs.get('start_date', date.today() - timedelta(days=1))
    end_date = kwargs.get('end_date', date.today())

    logging.info(f"Fetching accounts for period: {start_date} to {end_date}")
    account_ids = get_relevant_accounts(start_date, end_date)
    logging.info(f"Found {len(account_ids)} accounts to process")

    if not account_ids:
        logging.info("No accounts to process")
        return []

    return account_ids

def process_accounts(**kwargs):
    """Process accounts in parallel."""
    ti = kwargs['ti']
    account_ids = ti.xcom_pull(task_ids='fetch_accounts')
    start_date = kwargs.get('start_date', date.today() - timedelta(days=1))
    end_date = kwargs.get('end_date', date.today())

    if not account_ids:
        logging.info("No accounts to process")
        return

    max_workers = min(6, len(account_ids))
    successful = failed = 0

    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        future_to_account = {
            executor.submit(process_account, account_id, start_date, end_date): account_id
            for account_id in account_ids
        }

        for future in as_completed(future_to_account):
            account_id = future_to_account[future]
            try:
                _, success = future.result()
                if success:
                    successful += 1
                    if successful % 100 == 0:
                        logging.info(f"Processed {successful} accounts successfully")
                else:
                    failed += 1
            except Exception as e:
                failed += 1
                logging.error(f"Error processing account {account_id}: {str(e)}")

    logging.info(f"Processing complete. Successful: {successful}, Failed: {failed}")

# Define the DAG
default_args = {
    'owner': 'airflow',
    'start_date': days_ago(1),
}

dag = DAG(
    'account_performance_processing',
    default_args=default_args,
    description='Process account performance data',
    schedule_interval='@daily',
    catchup=False,
)

# Define the tasks
fetch_accounts_task = PythonOperator(
    task_id='fetch_accounts',
    python_callable=fetch_accounts,
    provide_context=True,
    dag=dag,
)

process_accounts_task = PythonOperator(
    task_id='process_accounts',
    python_callable=process_accounts,
    provide_context=True,
    dag=dag,
)

# Set task dependencies
fetch_accounts_task >> process_accounts_task