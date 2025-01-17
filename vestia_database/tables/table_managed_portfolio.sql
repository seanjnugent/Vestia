CREATE TABLE managed_portfolio
(
    managed_portfolio_id integer NOT NULL,
    managed_portfolio_name character varying
    managed_portfolio_details json,
    managed_portfolio_status character varying(20),
    allocation json,
    date_created timestamp without time zone,
    date_updated timestamp without time zone,
),
    PRIMARY KEY (managed_portfolio_id);
