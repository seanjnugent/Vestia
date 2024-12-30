import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from datetime import date, timedelta
import json
import logging
from threading import Lock
import pandas as pd
import numpy as np
from typing import List, Dict
import traceback

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Load environment variables and setup connection
load_dotenv()
db_url = f"postgresql+psycopg2://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}/{os.getenv('DB_NAME')}"
engine = create_engine(db_url, pool_size=50, max_overflow=30)

BATCH_SIZE = 100  # Process 100 accounts at a time

def get_price_matrix(start_date: date, end_date: date, asset_ids: List[int]) -> pd.DataFrame:
    """Get a matrix of all prices for the date range, forward filling missing values."""
    query = text("""
        WITH dates AS (
            SELECT generate_series(cast(:start_date as date), cast(:end_date as date), interval '1 day') as date
        ),
        latest_prices AS (
            SELECT DISTINCT ON (d.date, p.asset_id)
                d.date::date as price_date,  -- Ensure date type
                p.asset_id,
                FIRST_VALUE(p.amount) OVER (
                    PARTITION BY d.date, p.asset_id
                    ORDER BY p.price_date DESC
                ) as price
            FROM dates d
            CROSS JOIN unnest(:asset_ids) as aid(asset_id)
            LEFT JOIN LATERAL (
                SELECT price_date, asset_id, amount
                FROM public.asset_price ap
                WHERE ap.asset_id = aid.asset_id
                AND ap.price_date <= d.date
                ORDER BY ap.price_date DESC
                LIMIT 1
            ) p ON true
            WHERE p.price_date IS NOT NULL
        )
        SELECT * FROM latest_prices
        ORDER BY price_date, asset_id
    """)

    try:
        df = pd.read_sql_query(
            query,
            engine,
            params={"start_date": start_date, "end_date": end_date, "asset_ids": asset_ids},
            parse_dates=['price_date']
        )

        logging.info(f"Loaded {len(df)} price records")

        # Create a complete date index
        date_range = pd.date_range(start=start_date, end=end_date, freq='D', normalize=True)

        # Pivot and forward fill prices
        price_matrix = df.pivot(index='price_date', columns='asset_id', values='price')

        # Reindex to ensure we have all dates and forward fill
        price_matrix = price_matrix.reindex(date_range)
        price_matrix.index = price_matrix.index.date  # Convert to date objects
        price_matrix.ffill(inplace=True)

        logging.info(f"Created price matrix with shape {price_matrix.shape}")
        return price_matrix

    except Exception as e:
        logging.error(f"Error in get_price_matrix: {str(e)}\n{traceback.format_exc()}")
        raise

def process_account_batch(account_ids: List[int], start_date: date, end_date: date, price_matrix: pd.DataFrame) -> List[Dict]:
    """Process a batch of accounts together."""
    try:
        # Load positions data
        positions_query = text("""
            WITH dates AS (
                SELECT generate_series(cast(:start_date as date), cast(:end_date as date), interval '1 day') as date
            )
            SELECT
                d.date::date as date,
                at.account_id,
                at.asset_id,
                COALESCE(SUM(at.asset_trade_quantity), 0) as daily_quantity
            FROM dates d
            CROSS JOIN unnest(:account_ids) as acc(account_id)
            LEFT JOIN public.asset_trade at
                ON at.account_id = acc.account_id
                AND at.date_completed::date = d.date
            GROUP BY d.date, at.account_id, at.asset_id
        """)
        positions_df = pd.read_sql_query(
            positions_query,
            engine,
            params={"start_date": start_date, "end_date": end_date, "account_ids": account_ids},
            parse_dates=['date']
        )
        positions_df['cumulative_quantity'] = positions_df.groupby(['account_id', 'asset_id'])['daily_quantity'].cumsum()
    except Exception as e:
        logging.error(f"Error loading positions data: {str(e)}")
        positions_df = pd.DataFrame(columns=['date', 'account_id', 'asset_id', 'daily_quantity', 'cumulative_quantity'])

    try:
        # Load cash data
        cash_query = text("""
            WITH dates AS (
                SELECT generate_series(cast(:start_date as date), cast(:end_date as date), interval '1 day') as date
            )
            SELECT
                d.date::date as date,
                ct.account_id,
                COALESCE(SUM(ct.amount), 0) as daily_cash_change
            FROM dates d
            CROSS JOIN unnest(:account_ids) as acc(account_id)
            LEFT JOIN public.cash_trade ct
                ON ct.account_id = acc.account_id
                AND ct.date_completed::date = d.date
                AND ct.cash_trade_status = 'Completed'
            GROUP BY d.date, ct.account_id
        """)
        cash_df = pd.read_sql_query(
            cash_query,
            engine,
            params={"start_date": start_date, "end_date": end_date, "account_ids": account_ids},
            parse_dates=['date']
        )
        cash_df['cumulative_cash'] = cash_df.groupby('account_id')['daily_cash_change'].cumsum()
    except Exception as e:
        logging.error(f"Error loading cash data: {str(e)}")
        cash_df = pd.DataFrame(columns=['date', 'account_id', 'daily_cash_change', 'cumulative_cash'])

    # Ensure missing dates are filled
    positions_df = positions_df.set_index(['date', 'account_id', 'asset_id']).unstack(fill_value=0).stack().reset_index()
    cash_df = cash_df.set_index(['date', 'account_id']).unstack(fill_value=0).stack().reset_index()

    logging.info(f"Loaded positions and cash data. Positions shape: {positions_df.shape}, Cash shape: {cash_df.shape}")

    # Calculate asset values using vectorized operations
    def calculate_value(row):
        try:
            if row['asset_id'] not in price_matrix.columns:
                return 0
            return row['cumulative_quantity'] * price_matrix.loc[row['date'], row['asset_id']]
        except Exception as e:
            logging.error(f"Error calculating value for row {row}: {str(e)}")
            return 0

    positions_df['asset_value'] = positions_df.apply(calculate_value, axis=1)

    # Group by date and account to get total asset values
    asset_values = positions_df.groupby(['date', 'account_id'])['asset_value'].sum().reset_index()

    # Merge with cash positions
    final_df = pd.merge(
        asset_values,
        cash_df,
        on=['date', 'account_id'],
        how='outer'
    ).fillna(0)

    # Prepare results
    results = []
    for account_id in account_ids:
        account_data = final_df[final_df['account_id'] == account_id]
        if not account_data.empty:
            performance_history = [{
                "date": row['date'].strftime('%Y-%m-%d'),
                "total_asset_value": float(row['asset_value']),
                "cash_balance": float(row['cumulative_cash'])
            } for _, row in account_data.iterrows()]

            results.append({
                "account_id": account_id,
                "performance_history": json.dumps(performance_history)
            })

    return results


def batch_update_performance(results: List[Dict]):
    """Update performance data in batches."""
    if not results:
        logging.info("No results to insert.")
        return

    query = text("""
        INSERT INTO public.account_performance (account_id, performance_history)
        VALUES (:account_id, CAST(:performance_history AS jsonb))
        ON CONFLICT (account_id) DO UPDATE
        SET performance_history = excluded.performance_history
    """)

    try:
        with engine.begin() as conn:
            logging.info(f"Inserting {len(results)} records")
            conn.execute(query, results)
    except Exception as e:
        logging.error(f"Error in batch_update_performance: {str(e)}\n{traceback.format_exc()}")
        raise

def main():
    logging.info("Starting optimized batch processing...")

    try:
        # Get all account IDs that have any trades
        with engine.connect() as conn:
            account_ids = [row[0] for row in conn.execute(text("""
                SELECT DISTINCT account_id
                FROM (
                    SELECT account_id FROM public.cash_trade
                    UNION
                    SELECT account_id FROM public.asset_trade
                ) a
            """))]

        if not account_ids:
            logging.info("No accounts found.")
            return

        # Define date range
        end_date = date.today()
        start_date = end_date - timedelta(days=365)

        # Get all unique asset IDs
        with engine.connect() as conn:
            asset_ids = [row[0] for row in conn.execute(text(
                "SELECT DISTINCT asset_id FROM public.asset_trade"
            ))]

        logging.info(f"Processing {len(account_ids)} accounts for {len(asset_ids)} assets")

        # Get price matrix for all assets once
        logging.info("Loading price matrix...")
        price_matrix = get_price_matrix(start_date, end_date, asset_ids)

        # Process accounts in batches
        successful = failed = 0
        for i in range(0, len(account_ids), BATCH_SIZE):
            batch = account_ids[i:i + BATCH_SIZE]
            logging.info(f"Processing batch {i//BATCH_SIZE + 1} of {(len(account_ids) + BATCH_SIZE - 1)//BATCH_SIZE}")

            try:
                results = process_account_batch(batch, start_date, end_date, price_matrix)
                batch_update_performance(results)
                successful += len(batch)

            except Exception as e:
                failed += len(batch)
                logging.error(f"Error processing batch {i//BATCH_SIZE + 1}: {str(e)}\n{traceback.format_exc()}")

        logging.info(f"Processing complete. Successful: {successful}, Failed: {failed}")

    except Exception as e:
        logging.error(f"Error in main: {str(e)}\n{traceback.format_exc()}")

if __name__ == "__main__":
    main()
