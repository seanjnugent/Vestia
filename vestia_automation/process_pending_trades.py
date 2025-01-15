import psycopg2
from psycopg2.extras import RealDictCursor
from decimal import Decimal
import logging
from datetime import datetime
import yfinance as yf

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class TradeProcessor:
    def __init__(self, db_connection):
        self.conn = db_connection
        self.cursor = self.conn.cursor(cursor_factory=RealDictCursor)

    def get_asset_code(self, asset_id):
        """Get the yfinance-compatible asset code"""
        self.cursor.execute("""
            SELECT asset_code 
            FROM public.asset 
            WHERE asset_id = %s
        """, (asset_id,))
        result = self.cursor.fetchone()
        return result['asset_code'] if result else None

    def get_live_price(self, asset_id):
        """Get real-time price from yfinance"""
        try:
            asset_code = self.get_asset_code(asset_id)
            if not asset_code:
                raise Exception(f"No asset code found for asset_id {asset_id}")

            ticker = yf.Ticker(asset_code)
            live_data = ticker.info
            live_price = Decimal(str(live_data.get('regularMarketPrice')))
            
            if not live_price:
                raise Exception(f"Could not get live price for {asset_code}")

            logger.info(f"Got live price for {asset_code}: {live_price}")
            
            self.cursor.execute("""
                SELECT currency_code
                FROM public.vw_latest_price
                WHERE asset_id = %s
            """, (asset_id,))
            currency_info = self.cursor.fetchone()

            return {
                'latest_price': live_price,
                'currency_code': currency_info['currency_code'] if currency_info else 'USD'
            }

        except Exception as e:
            logger.error(f"Error getting live price for asset {asset_id}: {str(e)}")
            return self.get_view_price(asset_id)

    def get_view_price(self, asset_id):
        """Fallback to getting price from view"""
        self.cursor.execute("""
            SELECT latest_price, currency_code
            FROM public.vw_latest_price
            WHERE asset_id = %s
        """, (asset_id,))
        return self.cursor.fetchone()

    def check_instruction_status(self, instruction_id):
        """Check if the associated instruction is still active"""
        if not instruction_id:
            return True  # Manual trades don't need instruction check
        
        self.cursor.execute("""
            SELECT instruction_status
            FROM public.instruction
            WHERE instruction_id = %s
        """, (instruction_id,))
        result = self.cursor.fetchone()
        return result and result['instruction_status'] == 'active'

    def get_pending_trades(self):
        """Get all pending trades - both instruction-based and manual"""
        self.cursor.execute("""
            WITH pending_trades AS (
                -- Get instruction-based trades
                SELECT 
                    ct.cash_trade_id,
                    ct.account_id,
                    ct.amount,
                    ct.instruction_id,
                    COALESCE(ct.asset_trade_id, at.asset_trade_id) as asset_trade_id,
                    at.asset_id,
                    at.target_quantity,
                    at.quote_price,
                    i.instruction_status,
                    a.asset_code,
                    'instruction' as trade_type
                FROM public.cash_trade ct
                JOIN public.asset_trade at 
                    ON ct.instruction_id = at.instruction_id 
                    AND ct.account_id = at.account_id
                JOIN public.instruction i
                    ON ct.instruction_id = i.instruction_id
                JOIN public.asset a
                    ON at.asset_id = a.asset_id
                WHERE ct.cash_trade_status = 'pending'
                AND ct.amount < 0
                AND at.asset_trade_status = 'pending'
                AND ct.instruction_id IS NOT NULL

                UNION ALL

                -- Get manual trades
                SELECT 
                    ct.cash_trade_id,
                    ct.account_id,
                    ct.amount,
                    ct.instruction_id,
                    ct.asset_trade_id,
                    at.asset_id,
                    at.target_quantity,
                    at.quote_price,
                    NULL as instruction_status,
                    a.asset_code,
                    'manual' as trade_type
                FROM public.cash_trade ct
                JOIN public.asset_trade at 
                    ON ct.asset_trade_id = at.asset_trade_id
                JOIN public.asset a
                    ON at.asset_id = a.asset_id
                WHERE ct.cash_trade_status = 'pending'
                AND ct.amount < 0
                AND at.asset_trade_status = 'pending'
                AND ct.instruction_id IS NULL
            )
            SELECT * FROM pending_trades
            FOR UPDATE OF cash_trade, asset_trade;
        """)
        return self.cursor.fetchall()

    def process_trade(self, trade):
        """Process a single trade with live pricing"""
        try:
            # Check instruction status for instruction-based trades
            if trade['instruction_id'] and not self.check_instruction_status(trade['instruction_id']):
                logger.warning(f"Cancelling trade {trade['asset_trade_id']} - instruction no longer active")
                self.cancel_trade(trade)
                return {'status': 'cancelled', 'trade_id': trade['asset_trade_id']}

            # Get live price
            price_info = self.get_live_price(trade['asset_id'])
            if not price_info:
                raise Exception(f"No price available for asset_id {trade['asset_id']}")

            live_price = Decimal(str(price_info['latest_price']))
            cash_amount = abs(Decimal(str(trade['amount'])))
            actual_quantity = (cash_amount / live_price).quantize(Decimal('0.000001'))

            # Calculate price difference percentage
            quote_price = Decimal(str(trade['quote_price']))
            price_diff_pct = ((live_price - quote_price) / quote_price * 100).quantize(Decimal('0.01'))
            
            trade_type = trade['trade_type']
            logger.info(f"{trade_type.capitalize()} trade - Price difference for {trade['asset_code']}: "
                       f"{price_diff_pct}% (Quote: {quote_price}, Live: {live_price})")

            # Update both trades in a transaction
            self.cursor.execute("""
                UPDATE public.cash_trade
                SET cash_trade_status = 'completed',
                    date_completed = CURRENT_TIMESTAMP,
                    date_updated = CURRENT_TIMESTAMP
                WHERE cash_trade_id = %s;

                UPDATE public.asset_trade
                SET asset_trade_status = 'completed',
                    filled_price = %s,
                    filled_quantity = %s,
                    date_completed = CURRENT_TIMESTAMP,
                    date_updated = CURRENT_TIMESTAMP
                WHERE asset_trade_id = %s;
            """, (
                trade['cash_trade_id'],
                live_price,
                actual_quantity,
                trade['asset_trade_id']
            ))

            return {
                'status': 'completed',
                'trade_type': trade_type,
                'cash_trade_id': trade['cash_trade_id'],
                'asset_trade_id': trade['asset_trade_id'],
                'asset_code': trade['asset_code'],
                'target_quantity': trade['target_quantity'],
                'filled_quantity': actual_quantity,
                'quote_price': quote_price,
                'filled_price': live_price,
                'price_difference_pct': price_diff_pct
            }

        except Exception as e:
            logger.error(f"Error processing trade {trade['asset_trade_id']}: {str(e)}")
            self.conn.rollback()
            raise

    def process_all_pending_trades(self):
        """Process all pending trades"""
        try:
            pending_trades = self.get_pending_trades()
            
            # Log breakdown of trade types
            instruction_trades = sum(1 for t in pending_trades if t['trade_type'] == 'instruction')
            manual_trades = sum(1 for t in pending_trades if t['trade_type'] == 'manual')
            logger.info(f"Found {len(pending_trades)} pending trades to process "
                       f"({instruction_trades} instruction-based, {manual_trades} manual)")

            results = []
            for trade in pending_trades:
                try:
                    result = self.process_trade(trade)
                    results.append(result)
                    self.conn.commit()
                    logger.info(f"Processed {trade['trade_type']} trade: {result}")
                except Exception as e:
                    logger.error(f"Failed to process {trade['trade_type']} trade {trade['asset_trade_id']}: {str(e)}")
                    continue

            # Summarize results
            completed = sum(1 for r in results if r['status'] == 'completed')
            cancelled = sum(1 for r in results if r['status'] == 'cancelled')
            logger.info(f"Processing complete: {completed} completed, {cancelled} cancelled")
            
            return results

        except Exception as e:
            logger.error(f"Error in trade processing: {str(e)}")
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
        processor = TradeProcessor(conn)
        results = processor.process_all_pending_trades()
        
    except Exception as e:
        logger.error(f"Error during processing: {str(e)}")
        
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    main()