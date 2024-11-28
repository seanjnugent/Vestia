from faker import Faker
import random
import json
import psycopg2
from datetime import datetime
from dotenv import load_dotenv
from psycopg2.pool import ThreadedConnectionPool
import os

# Load environment variables from .env file
load_dotenv()

# Database connection pool setup
db_user = os.getenv("DB_USER")
db_password = os.getenv("DB_PASSWORD")
db_host = os.getenv("DB_HOST")
db_name = os.getenv("DB_NAME")

# Postgres connection string for psycopg2
db_url = f"host={db_host} dbname={db_name} user={db_user} password={db_password}"
pool = ThreadedConnectionPool(1, 10, db_url)  # Adjust min/max connections as needed

# Map of supported countries with Faker locales
COUNTRY_LOCALES = {
    "KR": "ko_KR",
    "JP": "jp_JP",
    "GE": "ka_GE",
    "SK": "sk_SK",
    "SI": "sl_SI",
    "CY": "el_CY",
    "EE": "et_EE",
    "CN": "zh_CN",
    "LV": "lv_LV",
}

# Establish a Faker instance based on country code
def get_faker_instance(country_code):
    locale = COUNTRY_LOCALES.get(country_code, "en_US")
    return Faker(locale)

# Generate a single investor record aligned to the schema
def generate_investor(faker, country_code):
    return {
        "FirstName": faker.first_name(),
        "Surname": faker.last_name(),
        "DateOfBirth": faker.date_of_birth(minimum_age=18, maximum_age=90),
        "CountryOfResidence": country_code,
        "ResidentialAddress": json.dumps({
            "street": faker.street_address(),
            "city": faker.city(),
            "postcode": faker.postcode(),
            "country": country_code
        }, ensure_ascii=False),  # Set ensure_ascii=False to avoid Unicode escape sequences
        "ClientProfile": json.dumps({
            "investment_experience": random.choice(["Beginner", "Intermediate", "Advanced"]),
            "investment_goal": random.choice(["Growth", "Income", "Balanced"]),
            "risk_tolerance": random.choice(["Low", "Medium", "High"])
        }),
        "EmailAddress": faker.email(),
        "PhoneNumber": faker.phone_number(),
        "DateCreated": datetime.now(),
        "DateUpdated": datetime.now()
    }

# Insert generated data into the database
def insert_investors_into_db(investors):
    conn = pool.getconn()
    try:
        cursor = conn.cursor()
        insert_query = """
        INSERT INTO Client (
            FirstName, Surname, DateOfBirth, CountryOfResidence,
            ResidentialAddress, ClientProfile, EmailAddress, PhoneNumber,
            DateCreated, DateUpdated
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
        """
        for investor in investors:
            cursor.execute(insert_query, (
                investor["FirstName"],
                investor["Surname"],
                investor["DateOfBirth"],
                investor["CountryOfResidence"],
                investor["ResidentialAddress"],
                investor["ClientProfile"],
                investor["EmailAddress"],
                investor["PhoneNumber"],
                investor["DateCreated"],
                investor["DateUpdated"]
            ))
        conn.commit()
    except Exception as e:
        conn.rollback()
        print(f"Error inserting investors: {e}")
    finally:
        cursor.close()
        pool.putconn(conn)

# Main function to generate and insert investors
def generate_investors(country_code, number_of_investors):
    faker = get_faker_instance(country_code)
    investors = [generate_investor(faker, country_code) for _ in range(number_of_investors)]
    insert_investors_into_db(investors)

    print(f"Inserted {number_of_investors} investors for country {country_code}.")

# Example usage
if __name__ == "__main__":

    generate_investors("CN", 2)
