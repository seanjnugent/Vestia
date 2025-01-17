CREATE OR REPLACE FUNCTION public.get_portfolio_history(p_account_id integer, p_start_date timestamp without time zone, p_end_date timestamp without time zone)
 RETURNS TABLE(value_date timestamp without time zone, total_asset_value numeric, total_cash_value numeric, total_portfolio_value numeric, total_cost_basis numeric, net_performance numeric, total_return_percentage numeric)
 LANGUAGE sql
AS $function$
WITH RECURSIVE dates AS (
    SELECT p_start_date AS date
    UNION ALL
    SELECT date + INTERVAL '1 day'
    FROM dates
    WHERE date + INTERVAL '1 day' <= p_end_date
),
daily_positions AS (
    SELECT
        d.date,
        at.asset_id,
        SUM(CASE
            WHEN at.asset_trade_type = 'Buy' THEN at.asset_trade_quantity
            WHEN at.asset_trade_type = 'Sell' THEN -at.asset_trade_quantity
            ELSE 0
        END) AS remaining_units,
        SUM(CASE
            WHEN at.asset_trade_type = 'Buy' THEN at.asset_trade_quantity * at.asset_trade_unit_cost
            WHEN at.asset_trade_type = 'Sell' THEN -at.asset_trade_quantity * at.asset_trade_unit_cost
            ELSE 0
        END) AS total_cost_basis
    FROM dates d
    CROSS JOIN (
        SELECT DISTINCT asset_id
        FROM asset_trade
        WHERE account_id = p_account_id
    ) assets
    LEFT JOIN asset_trade at ON
        at.asset_id = assets.asset_id 
        AND at.account_id = p_account_id 
        AND at.date_completed <= d.date + INTERVAL '1 day' -- Include full day
        AND at.asset_trade_status = 'Completed'
    GROUP BY d.date, at.asset_id
),
daily_prices AS (
    SELECT
        d.date,
        dp.asset_id,
        dp.remaining_units,
        dp.total_cost_basis,
        COALESCE(
            (SELECT amount
             FROM asset_price p
             WHERE p.asset_id = dp.asset_id
             AND p.price_date <= d.date
             ORDER BY p.price_date DESC
             LIMIT 1),
            0
        ) AS price
    FROM dates d
    JOIN daily_positions dp ON dp.date = d.date
),
cash_positions AS (
    SELECT 
        d.date,
        COALESCE(
            SUM(CASE 
                WHEN ct.date_completed <= d.date + INTERVAL '1 day' 
                AND ct.cash_trade_status = 'Completed' 
                THEN ct.amount 
                ELSE 0 
            END),
            0
        ) AS cash_balance
    FROM dates d
    CROSS JOIN (SELECT account_id FROM account WHERE account_id = p_account_id) a
    LEFT JOIN cash_trade ct ON 
        ct.account_id = a.account_id
    GROUP BY d.date
)
SELECT
    d.date AS value_date,
    COALESCE(SUM(dp.remaining_units * dp.price), 0) AS total_asset_value,
    cp.cash_balance AS total_cash_value,
    COALESCE(SUM(dp.remaining_units * dp.price), 0) + cp.cash_balance AS total_portfolio_value,
    COALESCE(SUM(dp.total_cost_basis), 0) AS total_cost_basis,
    COALESCE(SUM(dp.remaining_units * dp.price - dp.total_cost_basis), 0) AS net_performance,
    CASE
        WHEN COALESCE(SUM(dp.total_cost_basis), 0) > 0
        THEN (COALESCE(SUM(dp.remaining_units * dp.price - dp.total_cost_basis), 0) /
              COALESCE(SUM(dp.total_cost_basis), 0) * 100)
        ELSE 0
    END AS total_return_percentage
FROM dates d
LEFT JOIN daily_prices dp ON dp.date = d.date
LEFT JOIN cash_positions cp ON cp.date = d.date
GROUP BY d.date, cp.cash_balance
ORDER BY d.date;
$function$
