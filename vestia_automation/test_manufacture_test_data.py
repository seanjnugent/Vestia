from airflow import DAG
from airflow.providers.postgres.hooks.postgres import PostgresHook
from airflow.operators.python_operator import PythonOperator
from airflow.utils.dates import days_ago
from datetime import datetime, timedelta
import logging
import random
import json
from faker import Faker
from sqlalchemy import create_engine, text
from sqlalchemy.pool import QueuePool

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Global connection pool
engine = None

def get_db_engine():
    """Retrieve the database engine using Airflow connection."""
    global engine
    if engine is None:
        hook = PostgresHook(postgres_conn_id='my_postgres_conn')
        engine = create_engine(hook.get_uri(), poolclass=QueuePool, pool_size=5, max_overflow=10)
    return engine

# Map of supported countries with Faker locales
COUNTRY_LOCALES = {
    "US": "en_US", "UA": "uk_UA", "TR": "tr_TR", "SK": "sk_SK", "SI": "sl_SI",
    "SE": "sv_SE", "RU": "ru_RU", "RO": "ro_RO", "PT": "pt_PT", "PL": "pl_PL",
    "NZ": "en_NZ", "NO": "no_NO", "NL": "nl_NL", "LV": "lv_LV", "LT": "lt_LT",
    "IT": "it_IT", "IE": "en_IE", "HU": "hu_HU", "GR": "el_GR", "GE": "ka_GE",
    "GB": "en_GB", "FR": "fr_FR", "FI": "fi_FI", "ES": "es_ES", "EE": "et_EE",
    "DK": "da_DK", "DE": "de_DE", "CZ": "cs_CZ", "CY": "el_CY", "CH": "de_CH",
    "CA": "en_CA", "BG": "bg_BG", "BE": "nl_BE", "AU": "en_AU", "AT": "de_AT",
    "AM": "hy_AM", "IN": "hi_IN"
}

# Establish a Faker instance based on country code
def get_faker_instance(country_code):
    locale = COUNTRY_LOCALES.get(country_code)
    return Faker(locale)

# Fetch adjusted country proportions from the database
def get_country_weights():
    engine = get_db_engine()
    try:
        with engine.connect() as conn:
            query = text("""
                WITH country_data AS (
                    SELECT
                        country_of_residence,
                        COUNT(*) AS country_count
                    FROM public.client
                    GROUP BY country_of_residence
                )
                SELECT
                    country_of_residence,
                    (country_count * 100.0 / SUM(country_count) OVER ()) AS original_percentage
                FROM country_data
                ORDER BY original_percentage DESC
            """)
            results = conn.execute(query).fetchall()
            return {row[0]: float(row[1]) for row in results}  # Country and weight as a dictionary
    except Exception as e:
        logging.error(f"Error fetching country weights: {e}")
        return {}

# Generate a single investor record aligned to the schema
def generate_investor(faker, country_code):
    return {
        "first_name": faker.first_name(),
        "surname": faker.last_name(),
        "date_of_birth": faker.date_of_birth(minimum_age=18, maximum_age=90),
        "country_of_residence": country_code,
        "residential_address": json.dumps({
            "street": faker.street_address(),
            "city": faker.city(),
            "postcode": faker.postcode(),
            "country": country_code
        }, ensure_ascii=False),
        "client_profile": json.dumps({
            "investment_experience": random.choice(["Beginner", "Intermediate", "Advanced"]),
            "investment_goal": random.choice(["Growth", "Income", "Balanced"]),
            "risk_tolerance": random.choice(["Low", "Medium", "High"])
        }),
        "email_address": faker.email(),
        "phone_number": faker.phone_number()
    }

# Insert generated data into the database
def insert_investors_into_db(investors):
    engine = get_db_engine()
    try:
        with engine.connect() as conn:
            insert_query = text("""
                INSERT INTO client (
                    first_name, surname, date_of_birth, country_of_residence,
                    residential_address, client_profile, email_address, phone_number
                ) VALUES (:first_name, :surname, :date_of_birth, :country_of_residence,
                          :residential_address, :client_profile, :email_address, :phone_number);
            """)
            for investor in investors:
                conn.execute(insert_query, **investor)
            conn.commit()
    except Exception as e:
        logging.error(f"Error inserting investors: {e}")

# Generate and insert 2 users
def create_users():
    country_weights = get_country_weights()
    if not country_weights:
        logging.error("No country weights found; aborting.")
        return

    country_choices = list(country_weights.keys())
    weight_values = list(country_weights.values())

    investors = []
    for _ in range(1):  # Create 2 users
        country_code = random.choices(country_choices, weights=weight_values, k=1)[0]
        faker = get_faker_instance(country_code)
        investors.append(generate_investor(faker, country_code))

    insert_investors_into_db(investors)
    logging.info(f"Inserted {len(investors)} users.")

# Generate and insert 2 accounts
def create_accounts():
    engine = get_db_engine()
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT client_id FROM public.client ORDER BY RANDOM() LIMIT 1"))
            client_ids = [row[0] for row in result]

            accounts_data = []
            for client_id in client_ids:
                account_data = {
                    "client_id": client_id,
                    "account_type": "investmentAccount",
                    "account_name": f"Investment Account {client_id}"
                }
                accounts_data.append(account_data)

            insert_query = text("""
                INSERT INTO account (client_id, account_type, account_name)
                VALUES (:client_id, :account_type, :account_name);
            """)
            for account in accounts_data:
                conn.execute(insert_query, **account)
            conn.commit()
            logging.info(f"Inserted {len(accounts_data)} accounts.")
    except Exception as e:
        logging.error(f"Error creating accounts: {e}")

# Generate and insert 5 deposits
def create_deposits():
    engine = get_db_engine()
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT account_id FROM public.account ORDER BY RANDOM() LIMIT 5"))
            account_ids = [row[0] for row in result]

        deposits_data = []
        for account_id in account_ids:
            amount = random.randint(50, 250)
            rounded_amount = round((amount - 25) / 75) * 75 + 25
            if rounded_amount == 0:
                continue

                deposit_data = {
                    "account_id": account_id,
                    "amount": rounded_amount,
                    "currency_code": 'USD',
                    "instruction_id": None,
                    "corporate_action_id": None,
                    "cash_trade_note": f"Cash deposit of {rounded_amount} USD",
                    "cash_trade_status": 'Completed',
                    "date_completed": datetime.now(),
                    "date_created": datetime.now(),
                    "date_updated": datetime.now(),
                    "trade_type": 'Deposit'
                }
                deposits_data.append(deposit_data)

            insert_query = text("""
                INSERT INTO cash_trade (
                    account_id, amount, currency_code, instruction_id, corporate_action_id,
                    trade_note, trade_status, date_completed, date_created, date_updated, trade_type
                ) VALUES (:account_id, :amount, :currency_code, :instruction_id, :corporate_action_id,
                          :cash_trade_note, :cash_trade_status, :date_completed, :date_created, :date_updated, :trade_type);
            """)
            for deposit in deposits_data:
                conn.execute(insert_query, **deposit)
            conn.commit()
            logging.info(f"Inserted {len(deposits_data)} deposits.")
    except Exception as e:
        logging.error(f"Error creating deposits: {e}")

# Generate and insert 10 trades
def create_trades():
    engine = get_db_engine()
    try:
        with engine.connect() as conn:
            for _ in range(25):  # Create 10 trades
                trade_type = random.choices(['Buy', 'Sell'], weights=[75, 25], k=1)[0]
                if trade_type == 'Buy':
                    result = conn.execute(text("SELECT account_id, available_cash_balance FROM public.vw_cash_balance WHERE available_cash_balance > 0 ORDER BY RANDOM() LIMIT 1"))
                    row = result.fetchone()
                    if row is None:
                        logging.error("No account with sufficient cash balance found.")
                        continue
                    account_id, cash_balance = row

                    result = conn.execute(text("SELECT asset_id, latest_price, currency_code FROM public.vw_latest_price ORDER BY RANDOM() LIMIT 1"))
                    asset_id, asset_price, currency_code = result.fetchone()
                    quantity = random.randint(1, 10)
                    total_cost = quantity * asset_price

                    if total_cost > cash_balance:
                        logging.warning(f"Insufficient cash balance for account {account_id}. Skipping trade.")
                        continue

                    conn.execute(text("""
                        INSERT INTO asset_trade (
                            account_id, asset_id, filled_units, filled_price, trade_type, trade_status, date_placed, date_created, date_updated, date_completed, quote_units, quote_price
                        ) VALUES (:account_id, :asset_id, :quantity, :asset_price, 'Buy', 'Completed', :now, :now, :now, :now, :quantity, :asset_price);
                    """), {
                        "account_id": account_id,
                        "asset_id": asset_id,
                        "quantity": quantity,
                        "asset_price": asset_price,
                        "now": datetime.now()
                    })

                    conn.execute(text("""
                        INSERT INTO cash_trade (
                            account_id, amount, currency_code, trade_status, trade_note, date_created, date_updated, date_completed, trade_type
                        ) VALUES (:account_id, :amount, :currency_code, 'Completed', :note, :now, :now, :now, 'Buy');
                    """), {
                        "account_id": account_id,
                        "amount": -total_cost,
                        "currency_code": currency_code,
                        "note": f"Bought {quantity} units of {asset_id}",
                        "now": datetime.now()
                    })

                elif trade_type == 'Sell':
                    result = conn.execute(text("SELECT account_id, asset_id, asset_holding FROM public.vw_asset_balance WHERE asset_holding > 0 ORDER BY RANDOM() LIMIT 1"))
                    row = result.fetchone()
                    if row is None:
                        logging.error("No account with sufficient asset balance found.")
                        continue
                    account_id, asset_id, asset_holding = row

                    result = conn.execute(text("SELECT latest_price, currency_code FROM public.vw_latest_price WHERE asset_id = :asset_id"), {"asset_id": asset_id})
                    asset_price, currency_code = result.fetchone()
                    quantity = random.randint(1, asset_holding)
                    total_cost = quantity * asset_price

                    conn.execute(text("""
                        INSERT INTO asset_trade (
                            account_id, asset_id, filled_units, filled_price, trade_type, trade_status, date_placed, date_created, date_updated, date_completed, quote_units, quote_price
                        ) VALUES (:account_id, :asset_id, :quantity, :asset_price, 'Sell', 'Completed', :now, :now, :now, :now, :quantity, :asset_price);
                    """), {
                        "account_id": account_id,
                        "asset_id": asset_id,
                        "quantity": -quantity,
                        "asset_price": asset_price,
                        "now": datetime.now()
                    })

                    conn.execute(text("""
                        INSERT INTO cash_trade (
                            account_id, amount, currency_code, trade_status, trade_note, date_created, date_updated, date_completed, trade_type
                        ) VALUES (:account_id, :amount, :currency_code, 'Completed', :note, :now, :now, :now, 'Buy');
                    """), {
                        "account_id": account_id,
                        "amount": total_cost,
                        "currency_code": currency_code,
                        "note": f"Sold {quantity} units of {asset_id}",
                        "now": datetime.now()
                    })

            conn.commit()
            logging.info("Inserted 10 trades.")
    except Exception as e:
        logging.error(f"Error creating trades: {e}")

# Define the DAG
default_args = {
    'owner': 'airflow',
    'start_date': days_ago(1),
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}

dag = DAG(
    'testing_manufacture_trader_behaviour',
    default_args=default_args,
    description='Simulate trading behavior by creating users, accounts, deposits, and trades',
    schedule_interval=timedelta(hours=2),  # Run every 2 hours
    catchup=False,
)

# Define tasks
create_users_task = PythonOperator(
    task_id='create_users',
    python_callable=create_users,
    dag=dag,
)

create_accounts_task = PythonOperator(
    task_id='create_accounts',
    python_callable=create_accounts,
    dag=dag,
)

create_deposits_task = PythonOperator(
    task_id='create_deposits',
    python_callable=create_deposits,
    dag=dag,
)

create_trades_task = PythonOperator(
    task_id='create_trades',
    python_callable=create_trades,
    dag=dag,
)

# Set task dependencies
create_users_task >> create_accounts_task >> create_deposits_task >> create_trades_task
