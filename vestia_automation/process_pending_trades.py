import psycopg2
from decimal import Decimal
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def process_trade(cursor, trade):
    try:
        # Common variables
        cash_amount = Decimal(str(trade['cash_amount']))
        live_price = Decimal(str(trade['live_price']))
        is_sell_trade = trade['trade_type'] == 'SELL'
        
        # Handle BUY trade
        if not is_sell_trade:
            # BUY logic
            if trade['trade_mode'] == 'VALUE':
                # Calculate number of units to buy
                actual_quantity = (cash_amount / live_price).quantize(Decimal('0.000001'))
            else:
                # Use specified `quote_units` directly for UNITS mode
                actual_quantity = Decimal(str(trade['quote_units']))

            if actual_quantity <= 0:
                raise ValueError("Invalid quantity for BUY trade.")

            # Log the action for debugging
            logger.info(f"Processing BUY trade: Asset {trade['asset_code']} "
                        f"Account {trade['account_id']} Units {actual_quantity} "
                        f"Live Price {live_price}")

            # Finalize the trade note
            trade_note = f"Bought {actual_quantity} units of {trade['asset_code']}"
        
        else:
            # SELL logic
            if trade['trade_mode'] == 'VALUE':
                # Calculate number of units to sell based on cash_amount and live_price
                actual_quantity = (cash_amount / live_price).quantize(Decimal('0.000001'))
            else:
                # Use specified `quote_units` directly for UNITS mode
                actual_quantity = Decimal(str(trade['quote_units']))

            # Ensure actual_quantity is negative for SELL trades
            if actual_quantity > 0:
                actual_quantity = -actual_quantity

            # Check if the account has enough units to sell
            cursor.execute("""
                SELECT SUM(asset_holding) AS total_holding
                FROM public.vw_asset_balance
                WHERE account_id = %s AND asset_id = %s
            """, (trade['account_id'], trade['asset_id']))
            asset_holding = cursor.fetchone()

            if not asset_holding or asset_holding['total_holding'] < abs(actual_quantity):
                logger.error(f"Insufficient units to sell: "
                             f"Asset ID {trade['asset_id']}, "
                             f"Account ID {trade['account_id']}, "
                             f"Holding {asset_holding['total_holding'] if asset_holding else 0}, "
                             f"Attempted {abs(actual_quantity)}")
                raise Exception(f"Insufficient units to sell for asset_id {trade['asset_id']}")

            # Log the action for debugging
            logger.info(f"Processing SELL trade: Asset {trade['asset_code']} "
                        f"Account {trade['account_id']} Units {actual_quantity} "
                        f"Live Price {live_price}")

            # Finalize the trade note
            trade_note = f"Sold {abs(actual_quantity)} units of {trade['asset_code']}"

        # Commit the trade (update database logic here)
        cursor.execute("""
            INSERT INTO public.trade_history 
            (account_id, asset_id, trade_type, quantity, trade_note, trade_time) 
            VALUES (%s, %s, %s, %s, %s, NOW())
        """, (trade['account_id'], trade['asset_id'], trade['trade_type'], actual_quantity, trade_note))

        logger.info(f"Trade processed successfully: {trade_note}")

    except Exception as e:
        logger.error(f"Error processing trade {trade['cash_trade_id']} (Trade Type: {trade['trade_type']}): "
                     f"Units: {trade.get('quote_units')}, Asset: {trade.get('asset_code')}, "
                     f"Error: {str(e)}")
        raise

def main():
    # Connect to the database
    connection = psycopg2.connect(
        dbname="your_db_name",
        user="your_db_user",
        password="your_db_password",
        host="your_db_host",
        port="your_db_port"
    )
    cursor = connection.cursor()

    try:
        # Fetch pending trades
        cursor.execute("SELECT * FROM public.pending_trades WHERE status = 'PENDING'")
        pending_trades = cursor.fetchall()

        logger.info(f"Fetched {len(pending_trades)} pending trades for processing.")

        for trade in pending_trades:
            process_trade(cursor, trade)

        # Commit all changes
        connection.commit()
        logger.info("All trades processed successfully.")
    
    except Exception as e:
        logger.error(f"Error in processing trades: {str(e)}")
        connection.rollback()
    
    finally:
        cursor.close()
        connection.close()

if __name__ == "__main__":
    main()
