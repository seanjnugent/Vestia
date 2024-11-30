import yfinance as yf
import pandas as pd
import psycopg2
from psycopg2 import sql
from dotenv import load_dotenv
import os
from datetime import datetime
import json  # Add this line at the top of your script

# Load environment variables from .env file
load_dotenv()

# Database connection setup
db_user = os.getenv("DB_USER")
db_password = os.getenv("DB_PASSWORD")
db_host = os.getenv("DB_HOST")
db_name = os.getenv("DB_NAME")

# Establish the connection using psycopg2
conn = psycopg2.connect(
    dbname=db_name, user=db_user, password=db_password, host=db_host
)
print(f"Connected to database: {db_name}")

def upsert_asset_data(symbol, name, asset_type, status, sector, industry, market_cap, shares_outstanding,
                      dividend_yield, pe_ratio, eps, fifty_two_week_high, fifty_two_week_low, volume,
                      average_volume, currency, country, logo_url, datecreated, dateupdated):
    query = """
        INSERT INTO asset (
            asset_code, asset_name, asset_type, asset_status, currency_code, asset_details, 
            date_created, date_updated
        )
        VALUES (
            %s, %s, %s, %s, %s, %s, %s, %s
        )
        ON CONFLICT (asset_code) DO UPDATE SET
            asset_name = EXCLUDED.asset_name,
            asset_type = EXCLUDED.asset_type,
            asset_status = EXCLUDED.asset_status,
            currency_code = EXCLUDED.currency_code,
            asset_details = EXCLUDED.asset_details,
            date_updated = EXCLUDED.date_updated
    """
    
    asset_details = {
        "sector": sector,
        "industry": industry,
        "market_cap": market_cap,
        "shares_outstanding": shares_outstanding,
        "dividend_yield": dividend_yield,
        "pe_ratio": pe_ratio,
        "eps": eps,
        "fifty_two_week_high": fifty_two_week_high,
        "fifty_two_week_low": fifty_two_week_low,
        "volume": volume,
        "average_volume": average_volume,
        "logo_url": logo_url,
        "country": country
    }

    try:
        with conn.cursor() as cursor:
            cursor.execute(
                query,
                (
                    symbol, name, asset_type, status, currency, 
                    json.dumps(asset_details),  # Convert asset details dict to JSON
                    datecreated, dateupdated
                ),
            )
            conn.commit()
        print(f"Upserted data for symbol: {symbol}")
        return 1
    except Exception as e:
        print(f"Error upserting data for symbol {symbol}: {e}")
        return 0


# Load symbols from your CSV file
csv_file = "constituents.csv"
symbols_df = pd.read_csv(csv_file)
symbols = symbols_df["Symbol"].tolist()

# Process and upsert data for each symbol
total_upserted = 0
for symbol in symbols:
    try:
        stock = yf.Ticker(symbol)
        info = stock.info

        # Extract data, with safe defaults if a field is missing
        name = info.get("longName", symbol)
        asset_type = info.get("sector", "Unknown")
        status = "Active"
        sector = info.get("sector")
        industry = info.get("industry")
        market_cap = info.get("marketCap")
        shares_outstanding = info.get("sharesOutstanding")
        dividend_yield = info.get("dividendYield")
        pe_ratio = info.get("trailingPE")
        eps = info.get("trailingEps")
        fifty_two_week_high = info.get("fiftyTwoWeekHigh")
        fifty_two_week_low = info.get("fiftyTwoWeekLow")
        volume = info.get("volume")
        average_volume = info.get("averageVolume")
        currency = info.get("currency")
        country = info.get("country")
        logo_url = info.get("logo_url")  # Adjust if a different source for logos

        datecreated = datetime.now()
        dateupdated = datetime.now()

        # Upsert the data
        rows_upserted = upsert_asset_data(
            symbol, name, asset_type, status, sector, industry, market_cap,
            shares_outstanding, dividend_yield, pe_ratio, eps, fifty_two_week_high,
            fifty_two_week_low, volume, average_volume, currency, country, logo_url,
            datecreated, dateupdated
        )
        total_upserted += rows_upserted

    except Exception as e:
        print(f"Error processing symbol {symbol}: {e}")

print(f"Total rows upserted: {total_upserted}")

# Close the database connection
conn.close()
