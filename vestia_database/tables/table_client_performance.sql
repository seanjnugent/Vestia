CREATE TABLE client_performance
(
    client_id integer NOT NULL,
    performance_date date NOT NULL,
    cash_balance numeric NOT NULL,
    total_asset_value numeric NOT NULL,
    date_created timestamp without time zone,
    date_updated timestamp without time zone
),
    PRIMARY KEY (client_id, performance_date);
ALTER TABLE client_performance ADD CONSTRAINT FOREIGN KEY (client_id) REFERENCES client(client_id);
