import random
from faker import Faker
from sqlalchemy import create_engine, text
from dotenv import load_dotenv
import os
from datetime import datetime, timedelta

# Load environment variables
load_dotenv()

# Database connection setup
db_user = os.getenv("DB_USER")
db_password = os.getenv("DB_PASSWORD")
db_host = os.getenv("DB_HOST")
db_name = os.getenv("DB_NAME")

db_url = f"postgresql+psycopg2://{db_user}:{db_password}@{db_host}/{db_name}"
engine = create_engine(db_url)
faker = Faker()

# Fetch client IDs
with engine.connect() as conn:
    result = conn.execute(text("SELECT client_id FROM public.client where client_id not in (select client_id from public.account) ORDER BY RANDOM() DESC limit 25"))
    client_ids = [row[0] for row in result]

# Define function to get a random date within the past year
def random_date_within_last_year():
    today = datetime.now()
    random_days = timedelta(days=random.randint(1, 365))
    return today - random_days

# Account type and naming template
account_type = "investmentAccount"
account_name_template = "Investment Account {}"

# Generate account data for each client
accounts_data = []

for clientid in client_ids:
    # Determine how many accounts to create for this client
    account_count = random.choices([1, 2, 3], weights=[0.85, 0.10, 0.05])[0]
    
    for i in range(account_count):
        account_data = {
            "client_id": clientid,
            "account_type": account_type,
            "account_name": account_name_template.format(i + 1)
        }
        accounts_data.append(account_data)

# Insert generated data into the account table
with engine.begin() as conn:
    for account in accounts_data:
        query = text("""
            INSERT INTO account (client_id, account_type, account_name)
            VALUES (:client_id, :account_type, :account_name)
        """)
        conn.execute(query, account)

print(f"Inserted {len(accounts_data)} accounts into the account table.")
