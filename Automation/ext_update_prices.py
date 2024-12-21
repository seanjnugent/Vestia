import yfinance as yf
import pandas as pd
from sqlalchemy import create_engine, text
from dotenv import load_dotenv
import os
import psycopg2

# Load environment variables from .env file
load_dotenv()

# Database connection setup
db_user = os.getenv("DB_USER")
db_password = os.getenv("DB_PASSWORD")
db_host = os.getenv("DB_HOST")
db_name = os.getenv("DB_NAME")

db_url = f"postgresql+psycopg2://{db_user}:{db_password}@{db_host}/{db_name}"
engine = create_engine(db_url)

# Fetch symbols from the Asset table in PostgreSQL
symbols = []
with engine.connect() as conn:
    result = conn.execute(text("SELECT Asset_Code FROM Asset WHERE Asset_Status = 'Active' "))
    for row in result:
        symbols.append(row[0])

# Fetch and process data for each symbol
all_data = []

for symbol in symbols:
    try:
        # Download stock data for each symbol
        df = yf.download(tickers=symbol, period="5d", interval="1d")

        # If no data is returned, skip this symbol
        if df.empty:
            print(f"No data for symbol: {symbol}")
            continue

        # Keep only relevant columns, rename, and add Symbol column
        df = df[['Close', 'High', 'Low', 'Open', 'Volume']].copy()
        df.columns = ['Close', 'High', 'Low', 'Open', 'Volume']
        df['Symbol'] = symbol
        df.reset_index(inplace=True)  # Flatten the Date index

        all_data.append(df)

    except Exception as e:
        print(f"Error fetching data for {symbol}: {e}")

# Combine all data into a single DataFrame with uniform columns
if all_data:
    combined_df = pd.concat(all_data, ignore_index=True)
    
    # Display a sample to verify data structure
    print("Sample data from combined DataFrame:")
    print(combined_df.head())

    # Create the temporary table 'prctemp'
    with engine.connect() as conn:
        conn.execute(text("""
            CREATE TEMPORARY TABLE IF NOT EXISTS prctemp (
                Date DATE,
                Symbol VARCHAR,
                Close NUMERIC,
                High NUMERIC,
                Low NUMERIC,
                Open NUMERIC,
                Volume INTEGER
            );
        """))

        # Use pandas to insert data into the temporary table
        combined_df.to_sql('prctemp', con=engine, if_exists='append', index=False)

    # Now move the data from the temporary table to the final table
    with psycopg2.connect(
        dbname=db_name, user=db_user, password=db_password, host=db_host
    ) as conn:
        with conn.cursor() as cursor:
            # SQL for upserting data from temporary table to the final price table
            cursor.execute("""
                INSERT INTO public.asset_price (asset_id, currency_code, amount, price_date, date_created, date_updated)
                SELECT 
                    a.asset_id,
                    'USD'::varchar(3),  -- Assuming USD is the currency for all assets
                    pst."Close"::numeric(18, 5),  -- Using 'Close' from the temporary table
                    pst."Date"::timestamp,  -- Using 'Date' from the temporary table
                    CURRENT_TIMESTAMP,  -- Date created
                    CURRENT_TIMESTAMP  -- Date updated
                FROM (
                    -- Deduplicate the temporary table based on symbol and date
                    SELECT DISTINCT ON (pst."Symbol", pst."Date") 
                        pst."Close", 
                        pst."Date", 
                        pst."Symbol"
                    FROM prctemp pst
                    ORDER BY pst."Symbol", pst."Date" DESC  -- Ensure the latest record is picked for each Symbol and Date
                ) pst
                JOIN public.asset a ON pst."Symbol" = a.asset_code
                ON CONFLICT (asset_id, price_date) 
                DO UPDATE 
                SET 
                    amount = EXCLUDED.amount,
                    date_updated = CURRENT_TIMESTAMP;  -- Update the amount and dateupdated if the record already exists

                DROP TABLE IF EXISTS prctemp;  -- Drop the temporary table after use
            """)

            # Commit the transaction
            conn.commit()

    print("Data fetch, temporary table creation, and insertion complete.")
else:
    print("No data fetched. Exiting.")
