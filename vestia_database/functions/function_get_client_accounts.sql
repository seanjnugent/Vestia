CREATE OR REPLACE FUNCTION public.get_client_accounts(client_id_param integer)
 RETURNS TABLE(account_id integer, client_id integer, account_type character varying, account_name character varying, model_id integer, date_created timestamp without time zone, date_updated timestamp without time zone, cash_balance_sum numeric, total_account_value numeric)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        a.account_id, 
        a.client_id, 
        a.account_type, 
        a.account_name, 
        a.managed_portfolio_id, 
        a.date_created, 
        a.date_updated,
cash_balances.cash_balance_sum,
        COALESCE(asset_value_sum, 0) + COALESCE(cash_balances.cash_balance_sum, 0) AS total_account_value
    FROM public.account a
    LEFT JOIN (
        SELECT vab.account_id, SUM(vab.asset_value) AS asset_value_sum
        FROM vw_asset_balance vab
        GROUP BY vab.account_id
    ) AS asset_balances ON a.account_id = asset_balances.account_id
    LEFT JOIN (
        SELECT vcb.account_id, SUM(vcb.total_cash_balance) AS cash_balance_sum -- Sum cash balances if needed
        FROM vw_cash_balance vcb
        GROUP BY vcb.account_id
    ) AS cash_balances ON a.account_id = cash_balances.account_id
    WHERE a.client_id = client_id_param;
END;
$function$
