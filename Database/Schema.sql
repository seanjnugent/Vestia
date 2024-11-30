CREATE TABLE "client" (
  "clientid" SERIAL PRIMARY KEY,
  "firstname" varchar(100),
  "surname" varchar(100),
  "dateofbirth" date,
  "countryofresidence" varchar(3),
  "residentialaddress" json,
  "clientprofile" json,
  "emailaddress" varchar(100),
  "phonenumber" varchar(20),
  "date_created" timestamp DEFAULT (current_timestamp),
  "date_updated" timestamp DEFAULT (current_timestamp)
);

CREATE TABLE "account" (
  "account_id" SERIAL PRIMARY KEY,
  "clientid" int,
  "accounttype" varchar(50),
  "accountname" varchar(100),
  "model_id" int,
  "currency_code" varchar(3),
  "date_created" timestamp DEFAULT (current_timestamp),
  "date_updated" timestamp DEFAULT (current_timestamp)
);

CREATE TABLE "asset" (
  "asset_id" SERIAL PRIMARY KEY,
  "asset_code" varchar(50),
  "asset_name" varchar(100),
  "asset_type" varchar(50),
  "asset_status" varchar(20),
  "currency_code" varchar(3),
  "asset_details" json,
  "date_created" timestamp DEFAULT (current_timestamp),
  "date_updated" timestamp DEFAULT (current_timestamp)
);

CREATE TABLE "instruction" (
  "instruction_id" SERIAL PRIMARY KEY,
  "instruction_type" varchar(20),
  "instruction_status" varchar(20),
  "instruction_details" json,
  "allocation" json,
  "date_created" timestamp DEFAULT (current_timestamp),
  "date_updated" timestamp DEFAULT (current_timestamp)
);

CREATE TABLE "model" (
  "model_id" SERIAL PRIMARY KEY,
  "model_details" json,
  "model_status" varchar(20),
  "allocation" json,
  "date_created" timestamp DEFAULT (current_timestamp),
  "date_updated" timestamp DEFAULT (current_timestamp)
);

CREATE TABLE "asset_trade" (
  "asset_trade_id" SERIAL PRIMARY KEY,
  "account_id" int,
  "asset_id" int,
  "asset_trade_quantity" numeric,
  "asset_trade_unit_cost" numeric,
  "asset_trade_type" varchar(50),
  "asset_trade_status" varchar(50),
  "asset_trade_note" varchar(100),
  "currency_code" varchar(3),
  "local_currency_amount" numeric,
  "model_id" int,
  "instruction_id" int,
  "corporate_action_id" int,
  "date_placed" timestamp,
  "date_completed" timestamp,
  "date_created" timestamp DEFAULT (current_timestamp),
  "date_updated" timestamp DEFAULT (current_timestamp)
);

CREATE TABLE "cash_trade" (
  "cash_trade_id" SERIAL PRIMARY KEY,
  "account_id" int,
  "cash_trade_amount" numeric,
  "currency_code" varchar(3),
  "instruction_id" int,
  "corporate_action_id" int,
  "cash_trade_note" varchar(100),
  "cash_trade_status" varchar(50),
  "date_completed" timestamp,
  "date_created" timestamp DEFAULT (current_timestamp),
  "date_updated" timestamp DEFAULT (current_timestamp)
);

CREATE TABLE "asset_price" (
  "price_id" SERIAL PRIMARY KEY,
  "asset_id" int,
  "currency_code" varchar(3) DEFAULT 'USD',
  "amount" numeric,
  "price_date" timestamp,
  "date_created" timestamp,
  "date_updated" timestamp DEFAULT (current_timestamp)
);

CREATE TABLE "corporate_action" (
  "corporate_action_id" SERIAL PRIMARY KEY,
  "asset_id" int,
  "corporate_action_type" varchar(20),
  "ex_date" timestamp,
  "date_posted" timestamp,
  "date_created" timestamp DEFAULT (current_timestamp),
  "date_updated" timestamp DEFAULT (current_timestamp)
);

ALTER TABLE "account" ADD FOREIGN KEY ("clientid") REFERENCES "client" ("clientid");

ALTER TABLE "asset_trade" ADD FOREIGN KEY ("account_id") REFERENCES "account" ("account_id");

ALTER TABLE "cash_trade" ADD FOREIGN KEY ("account_id") REFERENCES "account" ("account_id");

ALTER TABLE "asset_trade" ADD FOREIGN KEY ("asset_id") REFERENCES "asset" ("asset_id");

ALTER TABLE "account" ADD FOREIGN KEY ("model_id") REFERENCES "model" ("model_id");

ALTER TABLE "asset_trade" ADD FOREIGN KEY ("instruction_id") REFERENCES "instruction" ("instruction_id");

ALTER TABLE "asset_trade" ADD FOREIGN KEY ("model_id") REFERENCES "model" ("model_id");

ALTER TABLE "asset_price" ADD FOREIGN KEY ("asset_id") REFERENCES "asset" ("asset_id");

ALTER TABLE "cash_trade" ADD FOREIGN KEY ("corporate_action_id") REFERENCES "corporate_action" ("corporate_action_id");

ALTER TABLE "asset_trade" ADD FOREIGN KEY ("corporate_action_id") REFERENCES "corporate_action" ("corporate_action_id");

ALTER TABLE "corporate_action" ADD FOREIGN KEY ("asset_id") REFERENCES "asset" ("asset_id");
