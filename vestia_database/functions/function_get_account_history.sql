CREATE OR REPLACE FUNCTION public.get_account_history(p_account_id integer, p_start_date date, p_end_date date)
 RETURNS TABLE(value_date date, total_asset_value numeric, total_cash_value numeric, total_portfolio_value numeric)
 LANGUAGE sql
AS $function$
WITH RECURSIVE dates AS (
    SELECT p_start_date AS date
    UNION ALL
    SELECT date + 1
    FROM dates
    WHERE date < p_end_date
),
daily_asset_values AS (
    SELECT
        d.date,
        vab.asset_id,
        vab.asset_holding,
        COALESCE(
            (SELECT amount
             FROM asset_price ap
             WHERE ap.asset_id = vab.asset_id
               AND ap.price_date <= d.date
             ORDER BY ap.price_date DESC
             LIMIT 1),
            (SELECT amount
             FROM asset_price ap2
             WHERE ap2.asset_id = vab.asset_id
               AND ap2.price_date < d.date
             ORDER BY ap2.price_date DESC
             LIMIT 1)
        ) * vab.asset_holding AS asset_value
    FROM dates d
    CROSS JOIN (SELECT DISTINCT asset_id FROM asset_trade WHERE account_id = p_account_id) AS assets
    LEFT JOIN vw_asset_balance vab ON vab.account_id = p_account_id AND vab.asset_id = assets.asset_id
),
cash_positions AS (
    SELECT 
        d.date,
        SUM(CASE 
            WHEN ct.date_completed <= d.date THEN ct.amount
            ELSE 0
        END) as cash_balance
    FROM dates d
    LEFT JOIN cash_trade ct ON 
        ct.account_id = p_account_id AND
        ct.cash_trade_status = 'Completed'
    GROUP BY d.date
)
SELECT 
    d.date as value_date,
    COALESCE(SUM(dav.asset_value), 0) as total_asset_value,
    COALESCE(cp.cash_balance, 0) as total_cash_value,
    COALESCE(SUM(dav.asset_value), 0) + COALESCE(cp.cash_balance, 0) as total_portfolio_value
FROM dates d
LEFT JOIN daily_asset_values dav ON dav.date = d.date
LEFT JOIN cash_positions cp ON cp.date = d.date
GROUP BY d.date, cp.cash_balance
ORDER BY d.date;
$function$
