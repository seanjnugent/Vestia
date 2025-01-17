CREATE OR REPLACE FUNCTION public.get_client_payments(p_client_id integer)
 RETURNS TABLE(cash_trade_id integer, account_id integer, client_id integer, date_created timestamp without time zone, date_completed timestamp without time zone, cash_trade_status text, amount numeric, cash_trade_note text)
 LANGUAGE sql
AS $function$
SELECT
    a.cash_trade_id,
    a.account_id,
    b.client_id,
    a.date_created,
    a.date_completed,
    a.cash_trade_status,
    a.amount,
    a.cash_trade_note
FROM cash_trade a
INNER JOIN account b ON a.account_id = b.account_id
WHERE b.client_id = p_client_id  -- Add this WHERE clause to filter by client_id
$function$
