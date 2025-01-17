CREATE OR REPLACE FUNCTION public.post_buy_trade(p_account_id integer, p_asset_codes character varying[], p_quantities integer[], p_description text, p_status text DEFAULT 'Completed'::text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_total_cost DECIMAL := 0;
    v_asset_price DECIMAL;
    v_asset_id INT;
    v_currency_code VARCHAR;
    v_quantity INT;
    v_trade_cost DECIMAL;
BEGIN
    -- Loop through each asset in the arrays
    FOR i IN 1..array_length(p_asset_codes, 1) LOOP
        -- Get asset_id, price, and currency_code for the given asset_code
SELECT a.asset_id, ap.latest_price, ap.currency_code
INTO v_asset_id, v_asset_price, v_currency_code
FROM public.asset a
JOIN public.vw_latest_price ap ON ap.asset_code = a.asset_code  -- Fixed JOIN condition
WHERE a.asset_code = p_asset_codes[i];

        -- If asset is not found, raise an exception
        IF v_asset_id IS NULL THEN
            RAISE EXCEPTION 'Asset code % not found', p_asset_codes[i];
        END IF;

        -- Calculate total cost for each asset
        v_quantity := p_quantities[i];
        v_trade_cost := v_quantity * v_asset_price;

        -- Insert into the Asset_Trade table
        INSERT INTO public.asset_trade (
            account_id, asset_id, asset_trade_quantity, asset_trade_unit_cost, 
            asset_trade_type, asset_trade_status, date_placed, date_created, date_updated
        )
        VALUES (
            p_account_id, v_asset_id, v_quantity, v_asset_price, 
            'Buy', p_status, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        );

        -- Insert into the Cash_Trade table (deduct cash for purchase)
        INSERT INTO public.cash_trade (
            account_id, amount, currency_code, cash_trade_status, cash_trade_note, date_created, date_updated
        )
        VALUES (
            p_account_id, -v_trade_cost, v_currency_code, p_status, 
            p_description || ' | Bought ' || v_quantity || ' of asset ' || p_asset_codes[i], 
            CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        );
    END LOOP;

    -- Optionally, you could update the account's cash balance here if needed, 
    -- but it depends on whether you track it dynamically elsewhere.
    
END;
$function$
