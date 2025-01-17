CREATE OR REPLACE FUNCTION public.post_new_instruction(p_account_id integer, p_instruction_type character varying, p_instruction_frequency character varying, p_instruction_amount numeric, p_bank_account_id integer, p_first_date date, p_next_run_date date, p_allocation json)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
    new_instruction_id integer;
BEGIN
    -- Insert the new instruction
    INSERT INTO public.instruction (
        account_id,
        instruction_type,
        instruction_status,
        instruction_frequency,
        instruction_amount,
        bank_account_id,
        first_date,
        next_run_date,
        allocation
    )
    VALUES (
        p_account_id,
        p_instruction_type,
        'Active',
        p_instruction_frequency,
        p_instruction_amount,
        p_bank_account_id,
        p_first_date,
        p_next_run_date,
        p_allocation
    )
    RETURNING instruction_id INTO new_instruction_id;

    -- Return the new instruction ID
    RETURN new_instruction_id;

EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error Name: %', SQLERRM;
    RAISE NOTICE 'Error State: %', SQLSTATE;
    RETURN -1;
END;
$function$
