import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from datetime import date, timedelta
import json
from concurrent.futures import ThreadPoolExecutor, as_completed
import logging
from threading import Lock

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
engine = create_engine(db_url, pool_size=100, max_overflow=30)

# Lock for thread-safe database operations
db_lock = Lock()

def create_temp_tables():
    """Create temporary tables with indexes."""
    logging.info("Creating temporary tables...")
    with db_lock:
        with engine.begin() as conn:
            conn.execute(text("DROP TABLE IF EXISTS daily_positions"))
            conn.execute(text("DROP TABLE IF EXISTS daily_cash"))

            # Temporary table for cumulative asset balances
            conn.execute(text("""
                CREATE TEMP TABLE daily_positions AS
                WITH RECURSIVE dates AS (
                    SELECT CURRENT_DATE - INTERVAL '1 year' as date
                    UNION ALL
                    SELECT date + INTERVAL '1 day'
                    FROM dates
                    WHERE date < CURRENT_DATE
                )
                SELECT 
                    d.date,
                    at.account_id,
                    at.asset_id,
                    COALESCE(SUM(at.asset_trade_quantity), 0) as quantity
                FROM dates d
                LEFT JOIN public.asset_trade at 
                    ON at.date_completed::date <= d.date
                GROUP BY d.date, at.account_id, at.asset_id
            """))

            # Temporary table for cumulative cash balances
            conn.execute(text("""
                CREATE TEMP TABLE daily_cash AS
                WITH RECURSIVE dates AS (
                    SELECT CURRENT_DATE - INTERVAL '1 year' as date
                    UNION ALL
                    SELECT date + INTERVAL '1 day'
                    FROM dates
                    WHERE date < CURRENT_DATE
                )
                SELECT 
                    d.date,
                    ct.account_id,
                    COALESCE(SUM(ct.amount), 0) as balance
                FROM dates d
                LEFT JOIN public.cash_trade ct 
                    ON ct.date_completed::date <= d.date
                WHERE ct.cash_trade_status = 'Completed'
                GROUP BY d.date, ct.account_id
            """))

            logging.info("Temporary tables created successfully.")
def process_account(account_id, start_date, end_date):
    try:
        # Find first cash trade date
        with engine.connect() as conn:
            first_trade = conn.execute(
                text("SELECT MIN(date_completed::date) FROM public.cash_trade WHERE account_id = :account_id AND cash_trade_status = 'Completed'"),
                {"account_id": account_id}
            ).first()
            
            if not first_trade or not first_trade[0]:
                return account_id, False
                
            start_date = max(start_date, first_trade[0])

        query = text("""
            WITH dates AS (
                SELECT generate_series(:start_date, :end_date, INTERVAL '1 day') AS date
            ),
            asset_balances AS (
                -- Get cumulative asset quantities per day
                SELECT 
                    d.date,
                    at.asset_id,
                    SUM(at.asset_trade_quantity) as balance
                FROM dates d
                INNER JOIN public.asset_trade at ON 
                    at.account_id = :account_id AND
                    at.date_completed::date <= d.date
                GROUP BY d.date, at.asset_id
                HAVING SUM(at.asset_trade_quantity) != 0
            ),
              latest_prices AS (
                -- Get latest price for each asset for each date
                SELECT
                    d.date,
                    ap.asset_id,
                    ap.amount as price
                FROM dates d
                JOIN public.asset_price ap ON
                    ap.price_date = d.date
            ),
            daily_values AS (
                SELECT 
                    d.date,
                    COALESCE(SUM(ab.balance * lp.price), 0) as total_asset_value,
                    COALESCE((
                        SELECT SUM(amount)
                        FROM public.cash_trade
                        WHERE account_id = :account_id
                        AND cash_trade_status = 'Completed'
                        AND date_completed::date <= d.date
                    ), 0) as cash_balance
                FROM dates d
                LEFT JOIN asset_balances ab ON ab.date = d.date
                LEFT JOIN latest_prices lp ON 
                    lp.date = d.date AND 
                    lp.asset_id = ab.asset_id
                GROUP BY d.date
            )
            SELECT 
                date,
                total_asset_value,
                cash_balance
            FROM daily_values
            ORDER BY date
        """)

        with engine.connect() as conn:
            result = conn.execute(query, {
                "start_date": start_date,
                "end_date": end_date,
                "account_id": account_id
            }).mappings()

            final_data = [{
                "date": row["date"].date() if isinstance(row["date"], date) else row["date"],
                "total_asset_value": float(row["total_asset_value"]),
                "cash_balance": float(row["cash_balance"])
            } for row in result]

        with engine.begin() as conn:
            conn.execute(
                text("""
                    INSERT INTO public.account_performance (account_id, performance_history)
                    VALUES (:account_id, :performance_history)
                    ON CONFLICT (account_id) DO UPDATE 
                    SET performance_history = excluded.performance_history
                """),
                {
                    "account_id": account_id,
                    "performance_history": json.dumps(final_data, default=str)
                }
            )

        return account_id, True

    except Exception as e:
        logging.error(f"Error processing account {account_id}: {str(e)}")
        return account_id, False
    

def main():
    logging.info("Starting main process...")

    # Create temporary tables for daily balances
    try:
        create_temp_tables()
    except Exception as e:
        logging.error(f"Error creating temporary tables: {str(e)}")
        return

    # Fetch account IDs
    try:
        with engine.connect() as conn:
            account_ids = [row[0] for row in conn.execute(text("SELECT account_id FROM public.account"))]
            logging.info(f"Fetched {len(account_ids)} account IDs.")
    except Exception as e:
        logging.error(f"Error fetching account IDs: {str(e)}")
        return

    # Define date range
    end_date = date.today()
    start_date = end_date - timedelta(days=365)

    # Number of worker threads
    max_workers = min(100, len(account_ids))

    successful = failed = 0
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        # Submit tasks
        future_to_account = {
            executor.submit(process_account, account_id, start_date, end_date): account_id 
            for account_id in account_ids
        }

        # Process completed tasks
        for future in as_completed(future_to_account):
            account_id = future_to_account[future]
            try:
                account_id, success = future.result()
                if success:
                    successful += 1
                else:
                    failed += 1
            except Exception as e:
                failed += 1
                logging.error(f"Error processing account {account_id}: {str(e)}")

    logging.info(f"Processing complete. Successful: {successful}, Failed: {failed}")

if __name__ == "__main__":
    main()
