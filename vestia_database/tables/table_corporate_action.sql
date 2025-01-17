CREATE TABLE corporate_action
(
    corporate_action_id integer NOT NULL,
    asset_id integer,
    corporate_action_type character varying(20),
    ex_date timestamp without time zone,
    date_posted timestamp without time zone,
    date_created timestamp without time zone,
    date_updated timestamp without time zone
),
    PRIMARY KEY (corporate_action_id);
ALTER TABLE corporate_action ADD CONSTRAINT FOREIGN KEY (asset_id) REFERENCES asset(asset_id);
