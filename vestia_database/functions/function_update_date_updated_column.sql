CREATE OR REPLACE FUNCTION public.update_date_updated_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
   NEW.date_updated = NOW();
   RETURN NEW;
END;
$function$
