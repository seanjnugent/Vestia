CREATE OR REPLACE FUNCTION public.get_client_performance(p_client_id integer, start_date date, end_date date)
 RETURNS TABLE(performance_date date, total_asset_value numeric, cash_balance numeric)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT apn.performance_date, apn.total_asset_value, apn.cash_balance
    FROM public.client_performance apn
    WHERE apn.client_id = p_client_id
      AND apn.performance_date BETWEEN start_date AND end_date;
END;
$function$
