import random
import logging  # Make sure logging is imported
from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.python_operator import PythonOperator
from airflow.utils.dates import days_ago
from sqlalchemy import create_engine, text
from sqlalchemy.pool import QueuePool
import json  # For asset allocation JSON serialization
from airflow.hooks.postgres_hook import PostgresHook

# Define the DAG
default_args = {
    'owner': 'airflow',
    'start_date': datetime(2025, 1, 16),
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}

dag = DAG(
    'testing_manufacture_instructions',
    default_args=default_args,
    description='Generate instructions for random accounts',
    schedule_interval='0 23 * * *',  # Run daily at 11 PM
    catchup=False,
)

engine = None  # Global engine variable

def get_db_engine():
    """Retrieve the database engine using Airflow connection."""
    global engine
    if engine is None:
        hook = PostgresHook(postgres_conn_id='my_postgres_conn')
        engine = create_engine(hook.get_uri(), poolclass=QueuePool, pool_size=5, max_overflow=10)
    return engine
    
def generate_instructions():
    engine = get_db_engine()
    
    try:
        with engine.connect() as conn:
            # Fetch 100 random accounts
            accounts = conn.execute(text("SELECT account_id FROM account ORDER BY RANDOM() LIMIT 10")).fetchall()
            
            # Fetch all asset IDs
            assets = conn.execute(text("SELECT asset_id FROM asset")).fetchall()
            if not assets:
                logging.warning("No assets available for allocation.")
                return
            
            instructions = []
            
            for account in accounts:
                account_id = account[0]
                
                # Generate start date
                start_date = datetime(2025, 1, 18) + timedelta(days=random.randint(0, 29))
                
                # Random frequency
                frequency = random.choice(['daily', 'weekly', 'monthly'])
                
                # Random amount
                amount = random.randint(50, 5000)
                
                # Randomly allocate to assets
                asset_allocation = []
                remaining_assets = assets.copy()
                remaining_amount = amount
                
                while remaining_amount > 0 and remaining_assets:
                    asset = random.choice(remaining_assets)
                    asset_amount = min(random.randint(1, remaining_amount), remaining_amount)
                    asset_allocation.append({"asset_id": asset[0], "allocation_amount": asset_amount})
                    remaining_amount -= asset_amount
                    remaining_assets.remove(asset)  # Ensure unique allocation
                
                if not asset_allocation:
                    logging.warning(f"No allocation created for account_id {account_id}. Amount: {amount}, Remaining Assets: {len(assets)}")
                    continue
                
                instruction = {
                    "account_id": account_id,
                    "instruction_type": "RegularDeposit",
                    "instruction_status": "Active",
                    "instruction_frequency": frequency,
                    "instruction_amount": amount,
                    "bank_account_id": 1,  # Assuming a default bank account, adjust as needed
                    "first_date": start_date,
                    "next_run_date": start_date + timedelta(days=1 if frequency == 'daily' else 
                                                            7 if frequency == 'weekly' else 
                                                            30),  # Simplified calculation
                    "allocation": json.dumps(asset_allocation),
                    "date_created": datetime.now(),
                    "date_updated": datetime.now()
                }
                
                instructions.append(instruction)
            
            # Insert all instructions at once for efficiency
            if instructions:
                conn.execute(text("""
                    INSERT INTO instruction (
                        account_id, instruction_type, instruction_status, instruction_frequency, instruction_amount,
                        bank_account_id, first_date, next_run_date, allocation, date_created, date_updated
                    ) VALUES (
                        :account_id, :instruction_type, :instruction_status, :instruction_frequency, :instruction_amount,
                        :bank_account_id, :first_date, :next_run_date, :allocation, :date_created, :date_updated
                    )
                """), instructions)
                conn.commit()
                logging.info(f"Inserted {len(instructions)} instructions.")

    except Exception as e:
        logging.error(f"Error generating instructions: {e}")


# Define the PythonOperator
create_instructions_task = PythonOperator(
    task_id='create_instructions',
    python_callable=generate_instructions,
    dag=dag,
)

create_instructions_task
