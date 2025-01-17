CREATE TABLE instruction
(
    instruction_id integer NOT NULL,
    account_id integer,
    instruction_type character varying(20),
    instruction_status character varying(20),
    instruction_frequency character varying(20),
    instruction_amount numeric,
    bank_account_id integer,
    first_date date,
    next_run_date date,
    allocation json,
    date_created timestamp without time zone,
    date_updated timestamp without time zone
),
    PRIMARY KEY (instruction_id);
