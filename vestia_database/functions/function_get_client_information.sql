CREATE OR REPLACE FUNCTION public.get_client_information(p_client_id integer)
 RETURNS TABLE(client_id integer, first_name character varying, surname character varying, date_of_birth date, country_of_residence character varying, residential_address json, client_profile json, email_address character varying, phone_number character varying, date_created timestamp without time zone, date_updated timestamp without time zone, date_last_login date)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT
        public.client.client_id,
        public.client.first_name,
        public.client.surname,
        public.client.date_of_birth,
        public.client.country_of_residence,
        public.client.residential_address,
        public.client.client_profile,
        public.client.email_address,
        public.client.phone_number,
        public.client.date_created,
        public.client.date_updated,
        public.client.date_last_login
    FROM
        public.client
    WHERE
        public.client.client_id = p_client_id;
END;
$function$
