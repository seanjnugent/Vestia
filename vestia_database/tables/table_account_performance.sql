CREATE TABLE account_performance
(
    account_id integer NOT NULL,
    performance_date date NOT NULL,
    cash_balance numeric NOT NULL,
    total_asset_value numeric NOT NULL,
    date_created timestamp without time zone,
    date_updated timestamp without time zone
),
    PRIMARY KEY (account_id, performance_date);
ALTER TABLE account_performance ADD CONSTRAINT FOREIGN KEY (account_id) REFERENCES account(account_id);
ALTER TABLE account_performance ADD CONSTRAINT FOREIGN KEY (account_id) REFERENCES account(account_id) ON DELETE CASCADE;
