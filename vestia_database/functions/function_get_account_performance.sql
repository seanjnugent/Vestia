CREATE OR REPLACE FUNCTION public.get_account_performance(p_account_id integer, start_date date, end_date date)
 RETURNS TABLE(performance_date date, total_asset_value numeric, cash_balance numeric)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT apn.performance_date, apn.total_asset_value, apn.cash_balance
    FROM public.account_performance apn
    WHERE apn.account_id = p_account_id
      AND apn.performance_date BETWEEN start_date AND end_date;
END;
$function$
