import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from datetime import date, timedelta
import json
from concurrent.futures import ThreadPoolExecutor, as_completed
import logging

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Load environment variables
load_dotenv()

# Database connection setup
db_url = f"postgresql+psycopg2://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}/{os.getenv('DB_NAME')}"
engine = create_engine(db_url, pool_size=20, max_overflow=30)
def process_account(account_id, start_date, end_date):
    try:
        # Format the query to insert the dates directly into the SQL
        query = text(f"""
            WITH daily_series AS (
                SELECT generate_series('{start_date}'::date, '{end_date}'::date, '1 day'::interval) AS date
            ),
            asset_values AS (
                SELECT
                    ds.date,
                    COALESCE(SUM(
                        at.asset_trade_quantity * (
                            SELECT amount::float
                            FROM asset_price ap
                            WHERE ap.asset_id = at.asset_id
                            AND ap.price_date::date <= ds.date
                            ORDER BY ap.price_date DESC
                            LIMIT 1
                        )
                    ), 0.0) as total_asset_value
                FROM daily_series ds
                LEFT JOIN asset_trade at ON
                    at.account_id = :account_id
                    AND at.date_completed::date <= ds.date
                GROUP BY ds.date
            ),
            cash_balances AS (
                SELECT
                    ds.date,
                    COALESCE(SUM(ct.amount::float), 0.0) as cash_balance
                FROM daily_series ds
                LEFT JOIN cash_trade ct ON
                    ct.account_id = :account_id
                    AND ct.date_completed::date <= ds.date
                    AND ct.cash_trade_status = 'Completed'
                GROUP BY ds.date
            )
            SELECT
                av.date,
                av.total_asset_value,
                cb.cash_balance
            FROM asset_values av
            JOIN cash_balances cb USING (date)
            ORDER BY av.date
        """)

        # Bind account_id parameter
        with engine.connect() as conn:
            result = [{
                "date": row[0].strftime('%Y-%m-%d') if isinstance(row[0], date) else str(row[0]),
                "total_asset_value": float(row[1]),
                "cash_balance": float(row[2])
            } for row in conn.execute(query, {
                "start_date": start_date,
                "end_date": end_date,
                "account_id": account_id
            })]

            if result:
                conn.execute(
                    text("""
                        INSERT INTO account_performance (account_id, performance_history)
                        VALUES (:account_id, :history)
                        ON CONFLICT (account_id)
                        DO UPDATE SET performance_history = excluded.performance_history
                    """),
                    {
                        "account_id": account_id,
                        "history": json.dumps(result),
                    }
                )
                return account_id, True

        return account_id, False

    except Exception as e:
        logging.error(f"Error processing account {account_id}: {str(e)}")
        return account_id, False




def main():
    logging.info("Starting performance calculation process...")

    # Fetch active account IDs
    try:
        with engine.connect() as conn:
            account_ids = [row[0] for row in conn.execute(text("""
                SELECT DISTINCT account_id 
                FROM (
                    SELECT account_id FROM asset_trade
                    UNION
                    SELECT account_id FROM cash_trade WHERE cash_trade_status = 'Completed'
                ) a
            """))]
            
        if not account_ids:
            logging.info("No accounts found to process.")
            return
            
        logging.info(f"Processing {len(account_ids)} accounts")
    except Exception as e:
        logging.error(f"Error fetching account IDs: {str(e)}")
        return

    # Define date range
    end_date = date.today()
    start_date = end_date - timedelta(days=365)

    # Process accounts in parallel
    max_workers = min(20, len(account_ids))
    successful = failed = 0

    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = {
            executor.submit(process_account, account_id, start_date, end_date): account_id 
            for account_id in account_ids
        }

        for future in as_completed(futures):
            _, success = future.result()
            if success:
                successful += 1
            else:
                failed += 1

    logging.info(f"Processing complete. Successful: {successful}, Failed: {failed}")

if __name__ == "__main__":
    main()