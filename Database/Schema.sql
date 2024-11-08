CREATE TABLE Client (
    ClientId SERIAL PRIMARY KEY,
    FirstName VARCHAR(100),
    Surname VARCHAR(100),
    DateOfBirth DATE,
    CountryOfResidence varchar (3),
    ResidentialAddress JSON,
    ClientProfile JSON,
    EmailAddress varchar(100),
    PhoneNumber varchar(20),
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
    AssetStatus VARCHAR(20),
    AssetDetails JSON,
    DateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    DateUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Instruction (
    InstructionId SERIAL PRIMARY KEY,
    InstructionType VARCHAR(20),
    InstructionStatus VARCHAR(20),
    InstructionDetails JSON,
    Allocation JSON,
    DateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    DateUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Model (
    ModelId SERIAL PRIMARY KEY,
    AssetId INT REFERENCES Asset(AssetId),
    ModelDetails JSON,
    ModelStatus varchar (20)
    Allocation JSON,
    DateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    DateUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Trade (
    TradeId SERIAL PRIMARY KEY,
    AccountId INT REFERENCES Account(AccountId),
    ClientId INT REFERENCES Client(ClientId),
    AssetId INT REFERENCES Asset(AssetId),
    InstructionId INT REFERENCES Instruction(InstructionId),
    ModelId INT REFERENCES Model(ModelId),
    TradeQuantity NUMERIC,
    TradeCost NUMERIC,
    TradeType VARCHAR(50),
    TradeStatus VARCHAR(50),
    DatePlaced TIMESTAMP CURRENT_TIMESTAMP,
    DateCompleted TIMESTAMP CURRENT_TIMESTAMP
    DateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    DateUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE Price (
    PriceId SERIAL PRIMARY KEY,
    AssetId INT REFERENCES Asset(AssetId),
    CurrencyCode VARCHAR(3) DEFAULT 'USD',
    Amount numeric
    PriceDate TIMESTAMP,
    DateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    DateUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
