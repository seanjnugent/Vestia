CREATE TABLE account
(
    account_id integer NOT NULL,
    client_id integer,
    account_type character varying(50),
    account_name character varying(100),
    managed_portfolio_id integer,
    date_created timestamp without time zone,
    date_updated timestamp without time zone
),
    PRIMARY KEY (account_id);
ALTER TABLE account ADD CONSTRAINT FOREIGN KEY (managed_portfolio_id) REFERENCES managed_portfolio(managed_portfolio_id);
ALTER TABLE account ADD CONSTRAINT FOREIGN KEY (client_id) REFERENCES client(client_id) ON DELETE CASCADE;
ALTER TABLE account ADD CONSTRAINT FOREIGN KEY (client_id) REFERENCES client(client_id) ON DELETE CASCADE;
