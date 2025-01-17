CREATE OR REPLACE FUNCTION public.get_account_summary(p_account_id integer)
 RETURNS TABLE(account_id integer, client_id integer, account_type character varying, account_name character varying, managed_portfolio_id integer, managed_portfolio_name character varying, date_created timestamp without time zone, date_updated timestamp without time zone, cash_balance numeric, total_asset_balance numeric)
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
        mp.managed_portfolio_name,
        a.date_created, 
        a.date_updated, 
        COALESCE(c.total_cash_balance, 0) AS cash_balance,
        COALESCE(ab.asset_value, 0) AS total_asset_balance
    FROM 
        public.account AS a  -- Alias the account table
    LEFT JOIN 
        public.vw_cash_balance AS c ON a.account_id = c.account_id
    LEFT JOIN (
        SELECT 
            vab.account_id,  -- Qualify account_id in the subquery
            SUM(vab.asset_value) AS asset_value
        FROM 
            public.vw_asset_balance AS vab  -- Alias the vw_asset_balance table in the subquery
        GROUP BY 
            vab.account_id
    ) AS ab ON a.account_id = ab.account_id
    LEFT JOIN 
        public.managed_portfolio AS mp ON a.managed_portfolio_id = mp.managed_portfolio_id
    WHERE 
        a.account_id = p_account_id;
END;
$function$
