

table "client" {
  "clientid" serial [pk, increment]
  "firstname" varchar(100)
  "surname" varchar(100)
  "dateofbirth" date
  "countryofresidence" varchar(3)
  "residentialaddress" json
  "clientprofile" json
  "emailaddress" varchar(100)
  "phonenumber" varchar(20)
  "date_created" timestamp [default: `current_timestamp`]
  "date_updated" timestamp [default: `current_timestamp`]
}


table "account" {
  "account_id" serial [pk, increment]
  "clientid" int
  "accounttype" varchar(50)
  "accountname" varchar(100)
  "model_id"  int
  "date_created" timestamp [default: `current_timestamp`]
  "date_updated" timestamp [default: `current_timestamp`]
}


table "asset" {
  "asset_id" serial [pk, increment]
  "asset_code" varchar(50)
  "asset_name" varchar(100)
  "asset_type" varchar(50)
  "asset_status" varchar(20)
  "currency_code" varchar(3)
  "asset_details" json
  "date_created" timestamp [default: `current_timestamp`]
  "date_updated" timestamp [default: `current_timestamp`]
}


table "instruction" {
  "instruction_id" serial [pk, increment]
  "instruction_type" varchar(20)
  "instruction_status" varchar(20)
  "instruction_details" json
  "allocation" json
  "date_created" timestamp [default: `current_timestamp`]
  "date_updated" timestamp [default: `current_timestamp`]
}


table "model" {
  "model_id" serial [pk, increment]
  "model_details" json
  "model_status" varchar(20)
  "allocation" json
  "date_created" timestamp [default: `current_timestamp`]
  "date_updated" timestamp [default: `current_timestamp`]
}


table "asset_trade" {
  "asset_trade_id" serial [pk, increment]
  "account_id" int
  "asset_id" int
  "asset_trade_quantity" numeric
  "asset_trade_unit_cost" numeric
  "asset_trade_type" varchar(50)
  "asset_trade_status" varchar(50)
  "asset_trade_note" varchar(100)
  "currency_code" varchar(3)
  "model_id" int
  "instruction_id" int
  "corporate_action_id" int
  "date_placed" timestamp
  "date_completed" timestamp
  "date_created" timestamp [default: `current_timestamp`]
  "date_updated" timestamp [default: `current_timestamp`]
}


table "cash_trade" {
  "cash_trade_id" serial [pk, increment]
  "account_id" int
  "cash_trade_amount" numeric
  "currency_code" varchar(3)
  "instruction_id" int
  "corporate_action_id" int
  "cash_trade_note" varchar(100)
  "cash_trade_status" varchar(50)
  "date_completed" timestamp
  "date_created" timestamp [default: `current_timestamp`]
  "date_updated" timestamp [default: `current_timestamp`]
}


table "asset_price" {
  "price_id" serial [pk, increment]
  "asset_id" int
  "currency_code" varchar(3) [default: 'usd']
  "amount" numeric
  "price_date" timestamp
  "date_created" timestamp
  "date_updated" timestamp [default: `current_timestamp`]
}


table "corporate_action" {
  "corporate_action_id" serial [pk, increment]
  "asset_id" int
  "corporate_action_type" varchar(20)
  "ex_date" timestamp
  "date_posted" timestamp
  "date_created" timestamp [default: `current_timestamp`]
  "date_updated" timestamp [default: `current_timestamp`]
  }


ref:"client"."clientid" < "account"."clientid"
ref:"account"."account_id" < "asset_trade"."account_id"
ref:"account"."account_id" < "cash_trade"."account_id"
ref:"asset"."asset_id" < "asset_trade"."asset_id"
ref:"model"."model_id" < "account"."model_id"
ref:"instruction"."instruction_id" < "asset_trade"."instruction_id"
ref:"model"."model_id" < "asset_trade"."model_id"
ref:"asset"."asset_id" < "asset_price"."asset_id"
ref:"cash_trade"."corporate_action_id" < "corporate_action"."corporate_action_id"
ref:"asset_trade"."corporate_action_id" < "corporate_action"."corporate_action_id"
ref:"asset"."asset_id" < "corporate_action"."asset_id"



