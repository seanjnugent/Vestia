import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DepositProcessor:
    def __init__(self, db_connection):
        self.conn = db_connection
        self.cursor = self.conn.cursor(cursor_factory=RealDictCursor)

    def process_pending_deposits(self):
        """
        Process all pending deposits:
        1. Find pending deposit cash trades
        2. Mark them as completed
        3. Log the processing
        """
        try:
            # Get pending deposits
            self.cursor.execute("""
                SELECT 
                    ct.cash_trade_id,
                    ct.account_id,
                    ct.amount,
                    ct.instruction_id
                FROM public.cash_trade ct
                WHERE ct.cash_trade_status = 'pending'
                AND ct.amount > 0  -- Only deposits (positive amounts)
                AND ct.cash_trade_note = 'Regular deposit'
                FOR UPDATE;  -- Lock rows for processing
            """)
            
            pending_deposits = self.cursor.fetchall()
            logger.info(f"Found {len(pending_deposits)} pending deposits to process")

            if not pending_deposits:
                logger.info("No pending deposits to process")
                return []

            # Process each deposit
            processed_deposits = []
            for deposit in pending_deposits:
                try:
                    self.cursor.execute("""
                        UPDATE public.cash_trade
                        SET cash_trade_status = 'completed',
                            date_completed = CURRENT_TIMESTAMP,
                            date_updated = CURRENT_TIMESTAMP
                        WHERE cash_trade_id = %s
                        RETURNING cash_trade_id, account_id, amount, date_completed;
                    """, (deposit['cash_trade_id'],))
                    
                    processed = self.cursor.fetchone()
                    processed_deposits.append(processed)
                    logger.info(f"Processed deposit {deposit['cash_trade_id']} for account {deposit['account_id']}")

                except Exception as e:
                    logger.error(f"Error processing deposit {deposit['cash_trade_id']}: {str(e)}")
                    self.conn.rollback()
                    continue

            self.conn.commit()
            return processed_deposits

        except Exception as e:
            logger.error(f"Error in deposit processing: {str(e)}")
            self.conn.rollback()
            raise

def main():
    db_params = {
        "dbname": "your_database",
        "user": "your_user",
        "password": "your_password",
        "host": "your_host",
        "port": "your_port"
    }
    
    try:
        conn = psycopg2.connect(**db_params)
        processor = DepositProcessor(conn)
        results = processor.process_pending_deposits()
        logger.info(f"Successfully processed {len(results)} deposits")
        
    except Exception as e:
        logger.error(f"Error during processing: {str(e)}")
        
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    main()