import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from datetime import date, timedelta
import logging
from threading import Lock
from concurrent.futures import ThreadPoolExecutor, as_completed
import pandas as pd

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Load environment variables
load_dotenv()

# Database connection setup with connection pooling
db_user = os.getenv("DB_USER")
db_password = os.getenv("DB_PASSWORD")
db_host = os.getenv("DB_HOST")
db_name = os.getenv("DB_NAME")

db_url = f"postgresql+psycopg2://{db_user}:{db_password}@{db_host}/{db_name}"
engine = create_engine(db_url, pool_size=50, max_overflow=30)

# Lock for thread-safe database operations
db_lock = Lock()

def get_relevant_accounts(start_date, end_date):
    """Get accounts that had activity in the specified date range."""
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
    try:
        # Query to get daily positions and values
        query = text("""
            WITH RECURSIVE date_series AS (
                SELECT 
                    generate_series(
                        date(:start_date),
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
        """)

        # Execute query and load results into DataFrame
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

        # Batch insert performance records
        insert_query = text("""
            INSERT INTO public.account_performance_new 
                (account_id, performance_date, total_asset_value, cash_balance)
            VALUES (:account_id, :performance_date, :total_asset_value, :cash_balance)
            ON CONFLICT (account_id, performance_date) 
            DO UPDATE SET
                total_asset_value = EXCLUDED.total_asset_value,
                cash_balance = EXCLUDED.cash_balance
        """)

        # Convert date column to date type
        df['date'] = pd.to_datetime(df['date']).dt.date

        # Prepare batch data
        records = [
            {
                "account_id": account_id,
                "performance_date": row['date'],
                "total_asset_value": float(row['total_asset_value']),
                "cash_balance": float(row['cash_balance'])
            }
            for _, row in df.iterrows()
        ]

        # Batch insert in chunks
        chunk_size = 1000
        with engine.begin() as conn:
            for i in range(0, len(records), chunk_size):
                chunk = records[i:i + chunk_size]
                conn.execute(insert_query, chunk)

        return account_id, True

    except Exception as e:
        logging.error(f"Error processing account {account_id}: {str(e)}")
        return account_id, False

def main(start_date=None, end_date=None):
    """
    Main function to process account performance data.
    
    Args:
        start_date (date, optional): Start date for processing. Defaults to yesterday.
        end_date (date, optional): End date for processing. Defaults to today.
    """
    logging.info("Starting account performance processing...")
    
    # Set default date range if not provided
    end_date = end_date or date.today()
    start_date = start_date or (end_date - timedelta(days=1))
    
    logging.info(f"Processing period: {start_date} to {end_date}")

    try:
        # Get relevant accounts
        account_ids = get_relevant_accounts(start_date, end_date)
        logging.info(f"Found {len(account_ids)} accounts to process")

        if not account_ids:
            logging.info("No accounts to process")
            return

        # Process accounts in parallel
        max_workers = min(12, len(account_ids))
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
                        if successful % 100 == 0:  # Log progress every 100 accounts
                            logging.info(f"Processed {successful} accounts successfully")
                    else:
                        failed += 1
                except Exception as e:
                    failed += 1
                    logging.error(f"Error processing account {account_id}: {str(e)}")

        logging.info(f"Processing complete. Successful: {successful}, Failed: {failed}")

    except Exception as e:
        logging.error(f"Error in main process: {str(e)}")

if __name__ == "__main__":
    # Example usage:
    # For daily run:
    # main()
    
    # For specific date range:
    main(start_date=date(2024, 11, 1), end_date=date(2024, 12, 30))
    #main()