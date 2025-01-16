import os
import psycopg2
from psycopg2 import sql
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Database connection setup
db_user = os.getenv("DB_USER")
db_password = os.getenv("DB_PASSWORD")
db_host = os.getenv("DB_HOST")
db_name = os.getenv("DB_NAME")

# Establish a connection to the database
conn = psycopg2.connect(
    dbname=db_name,
    user=db_user,
    password=db_password,
    host=db_host
)
cursor = conn.cursor()

def process_regular_deposits():
    try:
        # Step 1: Find regular deposits where nextRunDate is the current date
        cursor.execute("""
            SELECT 
                instruction_id, 
                instruction_details, 
                allocation, 
                account_id
            FROM 
                instruction
            WHERE 
                instruction_type = 'RegularDeposit'
                AND instruction_status = 'Active'
                AND nextRunDate = CURRENT_DATE;
        """)
        regular_deposits = cursor.fetchall()

        for deposit in regular_deposits:
            instruction_id, instruction_details, allocation, account_id = deposit
            amount = instruction_details['amount']
            frequency = instruction_details['frequency']
            assets = allocation['assets']

            # Step 2: Create pending cash trade for deposit
            cursor.execute("""
                INSERT INTO cash_trade (
                    account_id, 
                    amount, 
                    currency_code, 
                    instruction_id, 
                    cash_trade_status, 
                    date_created, 
                    date_updated
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (
                account_id, 
                amount, 
                'USD',  # Assuming USD as the currency, adjust as necessary
                instruction_id, 
                'Pending', 
                datetime.now(), 
                datetime.now()
            ))

            # Step 3: Create pending cash trade for buy trade (one per asset trade)
            for asset in assets:
                asset_id = asset['asset_id']
                allocation_amount = asset['allocation_amount']

                # Get the latest price for the asset
                cursor.execute("""
                    SELECT latest_price 
                    FROM public.vw_latest_price
                    WHERE asset_id = %s;
                """, (asset_id,))
                latest_price = cursor.fetchone()[0]

                # Calculate the number of units to buy
                units = float(allocation_amount) / latest_price

                # Insert cash trade for buy trade
                cursor.execute("""
                    INSERT INTO cash_trade (
                        account_id, 
                        amount, 
                        currency_code, 
                        instruction_id, 
                        cash_trade_status, 
                        cash_trade_note, 
                        date_created, 
                        date_updated
                    )
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    account_id, 
                    -float(allocation_amount), 
                    'USD',  # Assuming USD as the currency, adjust as necessary
                    instruction_id, 
                    'Pending', 
                    f"Buy {units:.2f} units of asset {asset_id}", 
                    datetime.now(), 
                    datetime.now()
                ))

                # Step 4: Create pending asset trade
                cursor.execute("""
                    INSERT INTO asset_trade (
                        account_id, 
                        asset_id, 
                        asset_trade_quantity, 
                        asset_trade_unit_cost, 
                        asset_trade_type, 
                        asset_trade_status, 
                        currency_code, 
                        local_currency_amount, 
                        instruction_id, 
                        date_placed, 
                        date_created, 
                        date_updated, 
                        quote_price, 
                        target_quantity
                    )
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    account_id, 
                    asset_id, 
                    units, 
                    latest_price, 
                    'Buy', 
                    'Pending', 
                    'USD',  # Assuming USD as the currency, adjust as necessary
                    float(allocation_amount), 
                    instruction_id, 
                    datetime.now(), 
                    datetime.now(), 
                    datetime.now(), 
                    latest_price, 
                    units
                ))

            # Step 5: Update nextRunDate in the instruction table
            if frequency == 'weekly':
                next_run_date = datetime.now() + timedelta(weeks=1)
            elif frequency == 'monthly':
                next_run_date = datetime.now() + timedelta(months=1)
            else:
                next_run_date = datetime.now()  # Default to current date if frequency is unknown

            cursor.execute("""
                UPDATE instruction
                SET 
                    nextRunDate = %s,
                    date_updated = %s
                WHERE 
                    instruction_id = %s;
            """, (next_run_date, datetime.now(), instruction_id))

        # Commit the transaction
        conn.commit()
        print("Regular deposits processed successfully.")

    except Exception as e:
        # Rollback in case of error
        conn.rollback()
        print(f"An error occurred: {e}")

    finally:
        # Close the cursor and connection
        cursor.close()
        conn.close()

# Run the process
process_regular_deposits()