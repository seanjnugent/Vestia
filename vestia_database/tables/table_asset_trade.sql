CREATE TABLE asset_trade
(
    asset_trade_id integer NOT NULL,
    account_id integer,
    asset_id integer,
    quote_units numeric,
    quote_price numeric,
    filled_units numeric,
    filled_price numeric,
    trade_type character varying(50),
    trade_status character varying(50),
    trade_note character varying(100),
    currency_code character varying(3),
    model_id integer,
    instruction_id integer,
    corporate_action_id integer,
    date_placed timestamp without time zone,
    date_completed timestamp without time zone,
    date_created timestamp without time zone,
    date_updated timestamp without time zone,
),
    PRIMARY KEY (asset_trade_id);
ALTER TABLE asset_trade ADD CONSTRAINT FOREIGN KEY (account_id) REFERENCES account(account_id);
ALTER TABLE asset_trade ADD CONSTRAINT FOREIGN KEY (asset_id) REFERENCES asset(asset_id);
ALTER TABLE asset_trade ADD CONSTRAINT FOREIGN KEY (model_id) REFERENCES managed_portfolio(managed_portfolio_id);
ALTER TABLE asset_trade ADD CONSTRAINT FOREIGN KEY (corporate_action_id) REFERENCES corporate_action(corporate_action_id);
ALTER TABLE asset_trade ADD CONSTRAINT FOREIGN KEY (account_id) REFERENCES account(account_id) ON DELETE CASCADE;
