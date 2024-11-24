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

def get_cash_balance(conn, account_id):
    with conn.cursor() as cur:
        cur.execute("""
            SELECT total_cash_balance
            FROM public.vw_cash_balance
            WHERE accountid = %s
            ORDER BY total_cash_balance DESC
            LIMIT 1;
        """, (account_id,))
        result = cur.fetchone()
    return result[0] if result else 0

def get_asset_balance(conn, account_id):
    with conn.cursor() as cur:
        cur.execute("""
            SELECT accountid, assetid, asset_holding
            FROM public.vw_asset_balance
            WHERE accountid = %s
            ORDER BY asset_holding DESC
            LIMIT 1;
        """, (account_id,))
        result = cur.fetchone()
    return result if result else None

def get_random_account_for_buy(conn):
    with conn.cursor() as cur:
        cur.execute("""
            SELECT accountid
            FROM public.vw_cash_balance
            WHERE total_cash_balance > 0
            ORDER BY total_cash_balance DESC
            LIMIT 1;
        """)
        return cur.fetchone()

def get_random_account_for_sell(conn):
    with conn.cursor() as cur:
        cur.execute("""
            SELECT accountid
            FROM public.vw_asset_balance
            WHERE asset_holding > 0
            ORDER BY asset_holding DESC
            LIMIT 1;
        """)
        return cur.fetchone()

def get_asset_list(conn):
    with conn.cursor() as cur:
        cur.execute("""
            SELECT assetid, latestprice, currencycode
            FROM public.vw_latest_price
            WHERE assetid != 699;
        """)
        return cur.fetchall()

def get_asset_price(conn, asset_id):
    with conn.cursor() as cur:
        cur.execute("""
            SELECT latestprice
            FROM public.vw_latest_price
            WHERE assetid = %s;
        """, (asset_id,))
        result = cur.fetchone()
    return result[0] if result else None

def simulate_trade(conn, trade_count):
    try:
        if trade_count > 100:
            print("Trade limit reached.")
            return
        
        # Randomly choose trade type: Buy or Sell
        trade_type = random.choices(['Buy', 'Sell'], weights=[75, 25], k=1)[0]

        if trade_type == 'Buy':
            random_account = get_random_account_for_buy(conn)
            if random_account:
                account_id = random_account[0]
                cash_balance = get_cash_balance(conn, account_id)

                # Only process if the cash balance is greater than 0
                if cash_balance <= 0:
                    print(f"Account {account_id} has insufficient cash balance (cash balance: {cash_balance}). Skipping.")
                    return

                # Retrieve the asset list (assets available for trade)
                assets = get_asset_list(conn)

                if not assets:
                    print(f"No assets available for trading for account {account_id}.")
                    return

                # Select a random asset to trade
                asset_id, asset_price, currency_code = random.choice(assets)

                # Determine the maximum quantity the user can afford to buy based on the cash balance
                max_quantity = cash_balance // asset_price

                # Debug print the max quantity
                print(f"Account {account_id} can afford {max_quantity} units of asset {asset_id}.")

                if max_quantity < 1:
                    print(f"Account {account_id} does not have enough balance to buy any asset.")
                    return

                trade_quantity = random.randint(1, max_quantity)
                trade_cost = trade_quantity * asset_price

                # Insert buy trade into the trade table
                with conn.cursor() as cur:
                    cur.execute("""
                        INSERT INTO public.trade (
                            accountid, assetid, tradequantity, tradecost, tradetype, tradestatus, datecreated, dateupdated
                        )
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                    """, (account_id, asset_id, trade_quantity, trade_cost, 'Buy', 'Completed', datetime.now(), datetime.now()))

                with conn.cursor() as cur:
                    cur.execute("""
                    INSERT INTO public.trade (
                        accountid, assetid, tradequantity, tradecost, tradetype, tradestatus, datecreated, dateupdated
                    )
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                """, (account_id, 699, trade_quantity, -trade_cost, 'Buy', 'Completed', datetime.now(), datetime.now()))

                conn.commit()

                print(f"Account {account_id} bought {trade_quantity} of asset {asset_id} at {asset_price} {currency_code}. Deducted {trade_cost} from cash.")

        elif trade_type == 'Sell':
            random_account = get_random_account_for_sell(conn)
            if random_account:
                account_id = random_account[0]
                asset_balance = get_asset_balance(conn, account_id)

                if asset_balance:
                    _, asset_id, asset_holding = asset_balance

                    # Fetch asset price
                    asset_price = get_asset_price(conn, asset_id)

                    if not asset_price:
                        print(f"Error: No price found for asset {asset_id}. Skipping sell.")
                        return

                    # Determine the trade quantity (randomly between 1 and asset_holding)
                    trade_quantity = random.randint(1, asset_holding)
                    trade_cost = trade_quantity * asset_price

                    # Insert sell trade into the trade table
                    with conn.cursor() as cur:
                        cur.execute("""
                            INSERT INTO public.trade (
                                accountid, assetid, tradequantity, tradecost, tradetype, tradestatus, datecreated, dateupdated
                            )
                            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                        """, (account_id, asset_id, trade_quantity * -1, trade_cost * -1, 'Sell', 'Completed', datetime.now(), datetime.now()))

                    with conn.cursor() as cur:
                        cur.execute("""
                    INSERT INTO public.trade (
                        accountid, assetid, tradequantity, tradecost, tradetype, tradestatus, datecreated, dateupdated
                    )
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                """, (account_id, 699, trade_quantity, trade_cost, 'Sell', 'Completed', datetime.now(), datetime.now()))

                    conn.commit()

                    print(f"Account {account_id} sold {trade_quantity} of asset {asset_id} at {asset_price}. Added {trade_cost} to cash.")

    except Exception as e:
        print(f"Error simulating trade: {e}")

# Example usage: Simulate trades for 5 random accounts
for i in range(15):  # Limit to 5 trades
    simulate_trade(conn, i)

conn.close()