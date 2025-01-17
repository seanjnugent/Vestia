CREATE TABLE client
(
    client_id integer NOT NULL,
    first_name character varying(100),
    surname character varying(100),
    date_of_birth date,
    country_of_residence character varying(3),
    residential_address json,
    client_profile json,
    email_address character varying(100),
    phone_number character varying(30),
    date_last_login date,
    password character varying
    date_created timestamp without time zone,
    date_updated timestamp without time zone,
),
    PRIMARY KEY (client_id);
