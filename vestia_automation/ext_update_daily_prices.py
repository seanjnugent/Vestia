from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.providers.postgres.hooks.postgres import PostgresHook
from airflow.utils.dates import days_ago
from datetime import timedelta
import logging
import yfinance as yf
import pandas as pd
from sqlalchemy import create_engine, text

# Default arguments for the DAG
default_args = {
    'owner': 'airflow',
    'start_date': days_ago(1),
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}

# Define the DAG
dag = DAG(
    'update_prices_simplified',
    default_args=default_args,
    description='Update asset prices from Yahoo Finance (simplified)',
    schedule_interval='0 22 * * *',  # Run daily at 10 PM
    catchup=False,
)

def update_prices():
    """
    Fetch data from Yahoo Finance and update the PostgreSQL database.
    """
    hook = PostgresHook(postgres_conn_id='my_postgres_conn')
    engine = hook.get_sqlalchemy_engine()

    try:
        # Fetch symbols
        symbols = []
        with engine.connect() as conn:
            result = conn.execute(text("SELECT Asset_Code FROM Asset WHERE Asset_Status = 'Active'"))
            for row in result:
                symbols.append(row[0])

        # Fetch and process data
        all_data = []
        for symbol in symbols:
            try:
                df = yf.download(tickers=symbol, period="5d", interval="1d")

                if df.empty:
                    logging.info(f"No data for symbol: {symbol}")
                    continue

                df = df[['Close', 'High', 'Low', 'Open', 'Volume']].copy()
                df.columns = ['close', 'high', 'low', 'open', 'volume']
                df['symbol'] = symbol
                df.reset_index(inplace=True)
                df = df.rename(columns={'Date': 'date'})

                all_data.append(df)

            except Exception as e:
                logging.error(f"Error fetching data for {symbol}: {e}")

        if all_data:
            combined_df = pd.concat(all_data, ignore_index=True)
            logging.info("Sample data from combined DataFrame:")
            logging.info(combined_df.head())

            with engine.connect() as conn:
                # Perform the upsert directly
                for _, row in combined_df.iterrows():
                    upsert_query = text("""
                        INSERT INTO public.asset_price (asset_id, currency_code, amount, price_date, date_created, date_updated)
                        SELECT 
                            a.asset_id,
                            'USD'::varchar(3),
                            CAST(:close AS NUMERIC(18, 5)),
                            CAST(:date AS TIMESTAMP),
                            CURRENT_TIMESTAMP,
                            CURRENT_TIMESTAMP
                        FROM public.asset a
                        WHERE a.asset_code = :symbol
                        ON CONFLICT (asset_id, price_date) 
                        DO UPDATE 
                        SET 
                            amount = EXCLUDED.amount,
                            date_updated = CURRENT_TIMESTAMP;
                    """)
                    conn.execute(
                        upsert_query,
                        close=row['close'],
                        date=row['date'],
                        symbol=row['symbol']
                    )
                conn.execute(text("COMMIT"))

            logging.info("Data fetch and upsert complete.")
        else:
            logging.info("No data fetched. Exiting.")

    except Exception as e:
        logging.error(f"An error occurred: {e}")
        raise

update_task = PythonOperator(
    task_id='update_prices',
    python_callable=update_prices,
    dag=dag,
)