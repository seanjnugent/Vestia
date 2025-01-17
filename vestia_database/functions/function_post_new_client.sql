CREATE OR REPLACE FUNCTION public.post_new_client(first_name character varying, surname character varying, date_of_birth date, residential_address json, country_of_residence character varying, client_profile json, email_address character varying, phone_number character varying)
 RETURNS SETOF record
 LANGUAGE plpgsql
AS $function$
DECLARE 
    inserted_id integer;
BEGIN
    INSERT INTO client (
        first_name, 
        surname, 
        date_of_birth, 
        residential_address, 
        country_of_residence, 
        client_profile, 
        email_address, 
        phone_number
    )
    VALUES (
        first_name, 
        surname, 
        date_of_birth, 
        residential_address, 
        country_of_residence,
        client_profile, 
        email_address, 
        phone_number
    )
    RETURNING client.client_id INTO inserted_id;
    
    RETURN QUERY SELECT inserted_id AS client_id, 'Client created successfully' AS message;
END;
$function$
