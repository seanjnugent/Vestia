CREATE OR REPLACE FUNCTION public.post_new_account(client_id integer, account_type character varying, account_name character varying, managed_portfolio_id integer)
 RETURNS TABLE(account_id integer, message text)
 LANGUAGE plpgsql
AS $function$
DECLARE 
    inserted_id integer;
BEGIN
    INSERT INTO account (
		client_id,
        account_type, 
        account_name, 
        managed_portfolio_id
    )
    VALUES (
		client_id,
        account_type, 
        account_name, 
        managed_portfolio_id
    )
    RETURNING account.account_id INTO inserted_id;
    
    RETURN QUERY 
    SELECT 
        inserted_id AS account_id, 
        'Account created successfully' AS message;
END;
$function$
