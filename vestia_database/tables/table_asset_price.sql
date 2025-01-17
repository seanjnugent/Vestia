CREATE TABLE asset_price
(
    price_id integer NOT NULL,
    asset_id integer,
    currency_code character varying(3),
    amount numeric,
    price_date timestamp without time zone,
    date_created timestamp without time zone,
    date_updated timestamp without time zone
),
    PRIMARY KEY (price_id);
ALTER TABLE asset_price ADD CONSTRAINT FOREIGN KEY (asset_id) REFERENCES asset(asset_id);
