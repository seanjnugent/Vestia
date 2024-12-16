import yfinance as yf
import pandas as pd
from sqlalchemy import create_engine, text
from dotenv import load_dotenv
import os

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
    result = conn.execute(text("SELECT AssetCode FROM Asset where AssetStatus = 'Active' and Asset_Type != 'Cash'"))
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
        df = df[['Adj Close', 'Close', 'High', 'Low', 'Open', 'Volume']].copy()
        df.columns = ['Adj_Close', 'Close', 'High', 'Low', 'Open', 'Volume']
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

    # Define the table structure in PostgreSQL (create if not exists)
    table_name = 'pricestaging'
    combined_df.to_sql(table_name, con=engine, if_exists='replace', index=False)

    # Insert or update data in the staging table
    combined_df.to_sql(name=table_name, con=engine, if_exists='append', index=False, method='multi')

    print("Data fetch and insertion complete.")
else:
    print("No data fetched. Exiting.")
