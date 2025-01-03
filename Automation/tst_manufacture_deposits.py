import random
import psycopg2
from datetime import datetime
from dotenv import load_dotenv
import os
from psycopg2.extras import execute_values

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
 (
    SELECT a.account_id 
    FROM public.account a
    WHERE NOT EXISTS (
        SELECT 1 
        FROM cash_trade t 
        WHERE t.account_id = a.account_id
    )
    ORDER BY RANDOM()
    LIMIT 25
)
UNION ALL
(
    SELECT a.account_id 
    FROM public.account a
    WHERE EXISTS (
        SELECT 1 
        FROM cash_trade t 
        WHERE t.account_id = a.account_id
    )
    ORDER BY RANDOM()
    LIMIT 2
);

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
        INSERT INTO cash_trade (
            account_id, amount, currency_code, instruction_id, corporate_action_id, 
            cash_trade_note, cash_trade_status, date_completed, date_created, date_updated)
        VALUES %s
    """
    try:
        with conn.cursor() as cursor:
            # Use psycopg2's execute_values for bulk insert
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
    
    # Skip if the rounded cash amount is zero
    if rounded_cash_amount == 0:
        continue
    
    # Create the note with the amount
    cash_trade_note = f"Cash deposit of {rounded_cash_amount} USD"
    
    datecreated = dateupdated = datecompleted = datetime.now()  # All timestamps set to now
    
    # Prepare the data as a tuple for bulk insert
    deposits_data.append((
        account_id, 
        rounded_cash_amount, 
        'USD',  # currency_code is set to 'USD'
        None,  # instruction_id is NULL
        None,  # corporate_action_id is NULL
        cash_trade_note,  # cash_trade_note
        'Completed',  # cash_trade_status
        datecompleted,  # date_completed
        datecreated,  # date_created
        dateupdated   # date_updated
    ))

# Insert the cash deposit trades in bulk, if there is any data
if deposits_data:
    insert_bulk_cash_deposits(deposits_data)
else:
    print("No valid cash deposits to insert.")

# Close the database connection
conn.close()
