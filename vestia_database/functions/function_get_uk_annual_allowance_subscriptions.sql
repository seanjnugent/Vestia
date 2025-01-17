CREATE OR REPLACE FUNCTION public.get_uk_annual_allowance_subscriptions(p_account_id integer DEFAULT NULL::integer)
 RETURNS TABLE(account_id integer, amount_deposited numeric)
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_current_year INT := EXTRACT(YEAR FROM NOW());
    v_tax_year_start DATE;
    v_tax_year_end DATE;
BEGIN
    -- Determine the UK tax year based on the current date.
    IF EXTRACT(MONTH FROM NOW()) >= 4 AND EXTRACT(DAY FROM NOW()) > 5 THEN
        v_tax_year_start := MAKE_DATE(v_current_year, 4, 6);
        v_tax_year_end := MAKE_DATE(v_current_year + 1, 4, 5);
    ELSE
        v_tax_year_start := MAKE_DATE(v_current_year -1, 4, 6);
        v_tax_year_end := MAKE_DATE(v_current_year, 4, 5);
    END IF;

    --RAISE NOTICE 'Tax year start: %, end: %', v_tax_year_start, v_tax_year_end;

    RETURN QUERY
    SELECT ct.account_id, SUM(ct.amount) AS amount_deposited
    FROM cash_trade ct
    WHERE ct.cash_trade_note LIKE 'Cash deposit%'
      AND ct.date_completed >= v_tax_year_start
      AND ct.date_completed <= v_tax_year_end
      AND (p_account_id IS NULL OR ct.account_id = p_account_id) -- Optional filter by account_id
    GROUP BY ct.account_id;
END;
$function$
