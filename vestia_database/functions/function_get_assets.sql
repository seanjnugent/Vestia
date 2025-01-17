CREATE OR REPLACE FUNCTION public.get_assets(p_asset_type text DEFAULT NULL::text)
 RETURNS TABLE(asset_id integer, asset_code character varying, asset_name character varying, latest_price numeric, currency_code character varying, asset_type character varying, asset_status character varying)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        a.asset_id,
        a.asset_code,
        a.asset_name,
        vlp.latest_price,
        a.currency_code,
        a.asset_type,
        a.asset_status
    FROM 
        asset a
    INNER JOIN 
        vw_latest_price vlp ON a.asset_id = vlp.asset_id
    WHERE 
        p_asset_type IS NULL OR a.asset_type = p_asset_type;
END;
$function$
