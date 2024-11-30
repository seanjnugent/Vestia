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
    "US": "en_US",
    "UA": "uk_UA",
    "TR": "tr_TR",
    "SK": "sk_SK",
    "SI": "sl_SI",
    "SE": "sv_SE",
    "RU": "ru_RU",
    "RO": "ro_RO",
    "PT": "pt_PT",
    "PL": "pl_PL",
    "NZ": "en_NZ",
    "NO": "no_NO",
    "NL": "nl_NL",
    "LV": "lv_LV",
    "LT": "lt_LT",
    "IT": "it_IT",
    "IE": "en_IE",
    "HU": "hu_HU",
    "GR": "el_GR",
    "GE": "ka_GE",
    "GB": "en_GB",
    "FR": "fr_FR",
    "FI": "fi_FI",
    "ES": "es_ES",
    "EE": "et_EE",
    "DK": "da_DK",
    "DE": "de_DE",
    "CZ": "cs_CZ",
    "CY": "el_CY",
    "CH": "de_CH",
    "CA": "en_CA",
    "BG": "bg_BG",
    "BE": "nl_BE",
    "AU": "en_AU",
    "AT": "de_AT",
    "AM": "hy_AM"
}

# Establish a Faker instance based on country code
def get_faker_instance(country_code):
    locale = COUNTRY_LOCALES.get(country_code)
    return Faker(locale)

# Fetch adjusted country proportions from the database
def get_country_weights():
    conn = pool.getconn()
    try:
        cursor = conn.cursor()
        query = """
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
        """
        cursor.execute(query)
        results = cursor.fetchall()
        return {row[0]: float(row[1]) for row in results}  # Country and weight as a dictionary
    except Exception as e:
        print(f"Error fetching country weights: {e}")
        return {}
    finally:
        cursor.close()
        pool.putconn(conn)

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
    conn = pool.getconn()
    try:
        cursor = conn.cursor()
        insert_query = """
        INSERT INTO client (
            first_name, surname, date_of_birth, country_of_residence,
            residential_address, client_profile, email_address, phone_number
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s);
        """
        for investor in investors:
            cursor.execute(insert_query, (
                investor["first_name"],
                investor["surname"],
                investor["date_of_birth"],
                investor["country_of_residence"],
                investor["residential_address"],
                investor["client_profile"],
                investor["email_address"],
                investor["phone_number"]
            ))
        conn.commit()
    except Exception as e:
        conn.rollback()
        print(f"Error inserting investors: {e}")
    finally:
        cursor.close()
        pool.putconn(conn)

# Main function to generate and insert investors
def generate_investors(number_of_investors):
    country_weights = get_country_weights()
    if not country_weights:
        print("No country weights found; aborting.")
        return

    country_choices = list(country_weights.keys())
    weight_values = list(country_weights.values())

    investors = []
    for _ in range(number_of_investors):
        country_code = random.choices(country_choices, weights=weight_values, k=1)[0]
        faker = get_faker_instance(country_code)
        investors.append(generate_investor(faker, country_code))

    insert_investors_into_db(investors)
    print(f"Inserted {number_of_investors} investors.")

# Example usage
if __name__ == "__main__":
    generate_investors(25)
