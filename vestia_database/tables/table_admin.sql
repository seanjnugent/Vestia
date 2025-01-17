CREATE TABLE admin
(
    admin_id integer NOT NULL,
    first_name character varying(100),
    surname character varying(100),
    date_of_birth date,
    country_of_residence character varying(3),
    registered_address json,
    email_address character varying(100),
    phone_number character varying(30),
    admin_type json,
    admin_profile json,
    date_last_login date,
    password_hashed character varying,
    date_created timestamp without time zone,
    date_updated timestamp without time zone
),
    PRIMARY KEY (admin_id);
