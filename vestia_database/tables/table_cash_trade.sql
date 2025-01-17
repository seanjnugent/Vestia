CREATE TABLE cash_trade
(
    cash_trade_id integer NOT NULL,
    account_id integer,
    amount numeric,
    currency_code character varying(3),
    trade_type character varying(50),
    trade_status character varying(50),
    trade_note character varying(100),
    instruction_id integer,
    corporate_action_id integer,
    linked_asset_trade_id integer,
    linked_cash_trade_id integer
    date_completed timestamp without time zone,
    date_created timestamp without time zone,
    date_updated timestamp without time zone,

),
    PRIMARY KEY (cash_trade_id);
ALTER TABLE cash_trade ADD CONSTRAINT FOREIGN KEY (account_id) REFERENCES account(account_id);
ALTER TABLE cash_trade ADD CONSTRAINT FOREIGN KEY (corporate_action_id) REFERENCES corporate_action(corporate_action_id);
ALTER TABLE cash_trade ADD CONSTRAINT FOREIGN KEY (account_id) REFERENCES account(account_id) ON DELETE CASCADE;
