CREATE OR REPLACE FUNCTION public.get_account_holdings(account_id_param integer)
 RETURNS TABLE(account_id integer, asset_id integer, asset_code character varying, asset_holding numeric, asset_value numeric, total_cost_basis numeric, total_buy_cost numeric, total_sell_proceeds numeric, net_cash_flow numeric, average_unit_cost numeric, net_performance numeric, total_return_percentage numeric)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        vab.account_id, 
        vab.asset_id, 
        a.asset_code, 
        vab.asset_holding, 
        vab.asset_value, 
        vab.total_cost_basis, 
        vab.total_buy_cost, 
        vab.total_sell_proceeds, 
        vab.net_cash_flow, 
        vab.average_unit_cost, 
        vab.net_performance, 
        vab.total_return_percentage
    FROM 
        public.vw_asset_balance vab
    INNER JOIN 
        asset a 
    ON 
        vab.asset_id = a.asset_id
    WHERE 
        vab.account_id = account_id_param;
END;
$function$
