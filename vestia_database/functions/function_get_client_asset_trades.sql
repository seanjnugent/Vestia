CREATE OR REPLACE FUNCTION public.get_client_asset_trades(p_client_id integer)
 RETURNS TABLE(asset_trade_id integer, account_id integer, client_id integer, date_created timestamp without time zone, date_completed timestamp without time zone, asset_trade_status text, asset_trade_quantity numeric, asset_trade_cost numeric, asset_trade_note text, asset_code text)
 LANGUAGE sql
AS $function$
    SELECT 
        a.asset_trade_id,
        a.account_id,
        b.client_id,
        a.date_created,
        a.date_completed,
        a.asset_trade_status,
        a.asset_trade_quantity,
        a.asset_trade_quantity * a.asset_trade_unit_cost as asset_trade_cost,
        a.asset_trade_note,
        c.asset_code
    FROM asset_trade a
    INNER JOIN account b ON a.account_id = b.account_id
    INNER JOIN asset c ON a.asset_id = c.asset_id
    WHERE b.client_id = p_client_id;
$function$
