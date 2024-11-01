CREATE TABLE Client (
    ClientId SERIAL PRIMARY KEY,
    FirstName VARCHAR(100),
    Surname VARCHAR(100),
    DateOfBirth DATE,
    DateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    DateUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Account (
    AccountId SERIAL PRIMARY KEY,
    ClientId INT REFERENCES Client(ClientId),
    AccountType VARCHAR(50),
    AccountName VARCHAR(100),
    DateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    DateUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Asset (
    AssetId SERIAL PRIMARY KEY,
    AssetCode VARCHAR(50),
    AssetName VARCHAR(100),
    AssetType VARCHAR(50),
    AssetDetails JSON,
    DateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    DateUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Instruction (
    InstructionId SERIAL PRIMARY KEY,
    InstructionType VARCHAR(20),
InstructionDetails JSON,
    Allocation JSON,
    DateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    DateUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Model (
    ModelId SERIAL PRIMARY KEY,
    AssetId INT REFERENCES Asset(AssetId),
ModelDetails JSON,
    Allocation JSON,
    DateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    DateUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Trade (
    TradeId SERIAL PRIMARY KEY,
    OrderId INT REFERENCES "Order"(OrderId),
    AccountId INT REFERENCES Account(AccountId),
    ClientId INT REFERENCES Client(ClientId),
    AssetId INT REFERENCES Asset(AssetId),
    InstructionId INT REFERENCES Instruction(InstructionId),
    ModelId INT REFERENCES Model(ModelId),
    TradeQuantity NUMERIC,
    TradeCost NUMERIC,
    TradeType VARCHAR(50),
    TradeStatus VARCHAR(50),
    DateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    DateUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE AssetOrder (
    AssetOrderId SERIAL PRIMARY KEY,
    AccountId INT REFERENCES Account(AccountId),
    AssetId INT REFERENCES Asset(AssetId),
    OrderType VARCHAR(50),
    OrderStatus VARCHAR(50),
    OrderQuantity NUMERIC,
    OrderUnitCost NUMERIC,
    DateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    DateUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
