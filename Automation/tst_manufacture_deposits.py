import random
import psycopg2
from datetime import datetime
from dotenv import load_dotenv
import os

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

def get_accounts_without_deposits():
    """Fetch accounts that have not made a cash deposit yet."""
    query = """
        SELECT accountid 
        FROM public.account a
        WHERE NOT EXISTS (
            SELECT 1 
            FROM trade t 
            WHERE t.accountid = a.accountid AND t.assetid = 699
        )
        ORDER BY RANDOM()
        LIMIT 10
    """
    try:
        with conn.cursor() as cursor:
            cursor.execute(query)
            accounts = cursor.fetchall()
            return [account[0] for account in accounts]
    except Exception as e:
        print(f"Error fetching accounts without deposits: {e}")
        return []

def insert_bulk_cash_deposits(deposits_data):
    """Insert a bulk of cash deposit trades into the database."""
    query = """
        INSERT INTO trade (
            accountid, assetid, tradequantity, tradecost, tradetype, tradestatus, dateplaced, 
            datecompleted, datecreated, dateupdated, instructionid, modelid
        )
        VALUES %s
    """
    try:
        with conn.cursor() as cursor:
            # Use psycopg2's execute_values for bulk insert
            from psycopg2.extras import execute_values
            execute_values(cursor, query, deposits_data)
            conn.commit()
        print(f"Inserted {len(deposits_data)} cash deposit trades.")
    except Exception as e:
        print(f"Error inserting bulk cash deposits: {e}")

# Get accounts that have not made a deposit yet
accounts_without_deposits = get_accounts_without_deposits()

# Prepare data for bulk insert
deposits_data = []
for account_id in accounts_without_deposits:
    # Generate a random amount between 50 and 5000
    cash_amount = random.randint(50, 5000)
    
    # Round the amount to the nearest thousand (e.g., 5346 becomes 5000, 2850 becomes 3000)
    rounded_cash_amount = round(cash_amount / 1000) * 1000  # Round to nearest thousand
    
    datecreated = dateupdated = datecompleted = datetime.now()  # All timestamps set to now
    
    # Prepare the data as a tuple for bulk insert (including instructionid and modelid as NULL)
    deposits_data.append((
        account_id, 699, rounded_cash_amount, rounded_cash_amount, 'CashDeposit', 'Completed', 
        datecreated, datecompleted, datecreated, dateupdated, None, None  # Default values for instructionid, modelid
    ))

# Insert the cash deposit trades in bulk
insert_bulk_cash_deposits(deposits_data)

# Close the database connection
conn.close()
