CREATE OR REPLACE FUNCTION public.get_client_summary(client_id_input integer)
 RETURNS TABLE(client_id integer, first_name character varying, surname character varying, total_client_value numeric, total_return_percentage numeric)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT
        c.client_id,
        c.first_name,
        c.surname,
        COALESCE(account_totals.total_account_value_sum, 0) AS total_client_value,
        COALESCE(AVG(b.total_return_percentage), 0) AS total_return_percentage
    FROM
        client c
    LEFT JOIN vw_client_performance b ON c.client_id = b.client_id
    LEFT JOIN (
        SELECT 
            a.client_id,
            SUM(COALESCE(asset_balances.asset_value_sum, 0) + COALESCE(cash_balances.account_total_cash_balance, 0)) AS total_account_value_sum
        FROM account a
        LEFT JOIN (
            SELECT vab.account_id, SUM(vab.asset_value) AS asset_value_sum
            FROM vw_asset_balance vab
            GROUP BY vab.account_id
        ) AS asset_balances ON a.account_id = asset_balances.account_id
        LEFT JOIN (
            SELECT vcb.account_id, SUM(vcb.total_cash_balance) AS account_total_cash_balance
            FROM vw_cash_balance vcb
            GROUP BY vcb.account_id
        ) AS cash_balances ON a.account_id = cash_balances.account_id
        GROUP BY a.client_id
    ) AS account_totals ON c.client_id = account_totals.client_id
    WHERE c.client_id = client_id_input
    GROUP BY c.client_id, c.first_name, c.surname, account_totals.total_account_value_sum;
END;
$function$
