from fastapi import FastAPI, Query
from pydantic import BaseModel
import pandas as pd
import psycopg2
from dotenv import load_dotenv
import os

load_dotenv()

# Database connection setup
db_user = os.getenv("DB_USER")
db_password = os.getenv("DB_PASSWORD")
db_host = os.getenv("DB_HOST")
db_name = os.getenv("DB_NAME")
# Create the FastAPI app
app = FastAPI()


# Define the response model
class AccountHistory(BaseModel):
    value_date: str
    total_asset_value: float
    total_cash_value: float
    total_portfolio_value: float

# Database connection parameters
db_params = {
    "dbname": db_name,
    "user": db_user,
    "password": db_password,
    "host": db_host,
    "port": 5432,
}

# Function to fetch data from DB (same as in previous Python code)
def fetch_data(account_id, start_date, end_date):
    conn = psycopg2.connect(**db_params)
    cursor = conn.cursor()
    asset_prices_query = """
    SELECT asset_id, price_date, amount
    FROM asset_price
    WHERE price_date BETWEEN %s AND %s;
    """
    cursor.execute(asset_prices_query, (start_date, end_date))
    asset_prices_df = pd.DataFrame(cursor.fetchall(), columns=["asset_id", "price_date", "amount"])

    asset_trades_query = """
    SELECT asset_trade_id, asset_id, asset_trade_quantity, asset_trade_type, date_placed, date_completed
    FROM asset_trade
    WHERE account_id = %s AND date_placed BETWEEN %s AND %s;
    """
    cursor.execute(asset_trades_query, (account_id, start_date, end_date))
    asset_trades_df = pd.DataFrame(cursor.fetchall(), columns=["asset_trade_id", "asset_id", "asset_trade_quantity", "asset_trade_type", "date_placed", "date_completed"])

    cash_trades_query = """
    SELECT date_completed, amount
    FROM cash_trade
    WHERE account_id = %s AND cash_trade_status = 'Completed'
    AND date_completed BETWEEN %s AND %s;
    """
    cursor.execute(cash_trades_query, (account_id, start_date, end_date))
    cash_trades_df = pd.DataFrame(cursor.fetchall(), columns=["date_completed", "amount"])

    cursor.close()
    conn.close()

    return asset_prices_df, asset_trades_df, cash_trades_df

# Function to calculate account history
@app.get("/account-history", response_model=list[AccountHistory])
def get_account_history(account_id: int, start_date: str, end_date: str):
    start_date = pd.to_datetime(start_date).date()
    end_date = pd.to_datetime(end_date).date()

    # Fetch necessary data
    asset_prices_df, asset_trades_df, cash_trades_df = fetch_data(account_id, start_date, end_date)

    # Your calculation logic here (same as before)

    # Example: Merge and return final dataframe in the required structure
    history_df = calculate_account_history(account_id, start_date, end_date)  # This function would return a pandas DataFrame

    # Convert to list of dicts for FastAPI to return JSON
    history_data = history_df.to_dict(orient="records")
    return history_data

# Example usage in frontend: Call /account-history endpoint with query params `account_id`, `start_date`, `end_date`.
