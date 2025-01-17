import os 
import psycopg2
from psycopg2 import sql
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Database connection setup
db_user = os.getenv("DB_USER")
db_password = os.getenv("DB_PASSWORD")
db_host = os.getenv("DB_HOST")
db_name = os.getenv("DB_NAME")

def get_db_connection():
    return psycopg2.connect(
        dbname=db_name,
        user=db_user,
        password=db_password,
        host=db_host
    )

def process_regular_deposits():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Step 1: Find active regular deposits due today
        cursor.execute("""
            SELECT 
                instruction_id,
                account_id,
                instruction_frequency,
                instruction_amount,
                allocation
            FROM 
                instruction
            WHERE 
                instruction_type = 'RegularDeposit'
                AND instruction_status = 'Active'
                AND next_run_date = CURRENT_DATE;
        """)
        regular_deposits = cursor.fetchall()

        for deposit in regular_deposits:
            instruction_id, account_id, frequency, amount, allocation = deposit
            
            # Step 2: Create pending cash deposit trade
            cursor.execute("""
                INSERT INTO cash_trade (
                    account_id,
                    amount,
                    currency_code,
                    instruction_id,
                    cash_trade_status,
                    cash_trade_note,
                    date_created,
                    date_updated,
                    cash_trade_type
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING cash_trade_id
            """, (
                account_id,
                amount,
                'USD',
                instruction_id,
                'Pending',
                'Regular deposit',
                datetime.now(),
                datetime.now(),
                'Deposit'
            ))
            
            # Capture the cash_trade_id from the initial deposit
            initial_cash_trade_id = cursor.fetchone()[0]
            
            # Step 3: Process each asset allocation
            for asset in allocation:
                asset_id = asset['asset_id']
                allocation_amount = asset['allocation_amount']
                
                # Get latest price for the asset
                cursor.execute("""
                    SELECT latest_price, asset_code 
                    FROM public.vw_latest_price 
                    WHERE asset_id = %s
                """, (asset_id,))
                latest_price = cursor.fetchone()[0]
                
                # Calculate units to buy
                units = float(allocation_amount) / float(latest_price)
                
                # Create pending asset trade
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
                    RETURNING asset_trade_id
                """, (
                    account_id,
                    asset_id,
                    units,
                    latest_price,
                    'Buy',
                    'Pending',
                    'USD',
                    float(allocation_amount),
                    instruction_id,
                    datetime.now(),
                    datetime.now(),
                    datetime.now(),
                    latest_price,
                    units
                ))
                
                # Capture the asset_trade_id
                asset_trade_id = cursor.fetchone()[0]
                
                # Create pending cash withdrawal for asset purchase, linking to the asset_trade_id
                cursor.execute("""
                    INSERT INTO cash_trade (
                        account_id,
                        amount,
                        currency_code,
                        instruction_id,
                        cash_trade_status,
                        cash_trade_note,
                        date_created,
                        date_updated,
                        asset_trade_id,
                        linked_cash_trade_id,
                        cash_trade_type
                    )
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    account_id,
                    -float(allocation_amount),
                    'USD',
                    instruction_id,
                    'Pending',
                    f'Buy {allocation_amount:.4f} USD of {asset_id}',
                    datetime.now(),
                    datetime.now(),
                    asset_trade_id,
                    initial_cash_trade_id,
                    'Buy'
                ))
            
            # Step 4: Update next run date based on frequency
            next_run_date = datetime.now()
            if frequency == 'weekly':
                next_run_date += timedelta(weeks=1)
            elif frequency == 'monthly':
                next_run_date += relativedelta(months=1)
            elif frequency == 'yearly':
                next_run_date += relativedelta(years=1)
            
            cursor.execute("""
                UPDATE instruction
                SET 
                    next_run_date = %s,
                    date_updated = %s
                WHERE 
                    instruction_id = %s
            """, (
                next_run_date.date(),
                datetime.now(),
                instruction_id
            ))

        # Commit all changes
        conn.commit()
        print("Regular deposits processed successfully.")

    except Exception as e:
        conn.rollback()
        print(f"An error occurred: {e}")
        raise

    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    process_regular_deposits()
