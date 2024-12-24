import React, { useState } from "react";
import BuyTrade from "../components/trades/BuyTrade";
import SellTrade from "../components/trades/SellTrade";
import ProgressTracker from "../components/ProgressTracker";
import AccountSelection from "../components/AccountSelection";

const NewTrade = () => {
  const [stage, setStage] = useState(0);
  const [account, setAccount] = useState(null); // Store the selected account object
  const [tradeType, setTradeType] = useState("buy");

  const accounts = [
    // Add sample accounts if necessary or use data from API
  ];

  const steps = ["Account", "Asset", "Amount", "Review"];

  const renderStageContent = () => {
    switch (stage) {
      case 0:
        return (
          <AccountSelection
            accounts={accounts}
            selectedAccount={account}
            setSelectedAccount={setAccount}
            onContinue={(selectedAccount) => {
              setAccount(selectedAccount); // Set the selected account object
              setStage(1);
            }}
          />
        );
      case 1:
      case 2:
      case 3:
        return tradeType === "buy" ? (
          <BuyTrade
            stage={stage}
            setStage={setStage}
            account={account} // Pass the selected account object
          />
        ) : (
          <SellTrade
            stage={stage}
            setStage={setStage}
            account={account} // Pass the selected account object
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-6 bg-white shadow-lg rounded-xl border border-gray-200">
      <ProgressTracker currentStep={stage + 1} steps={steps} />
      {stage === 1 && (
        <div className="flex justify-between mb-4">
          {["buy", "sell"].map((type) => (
            <button
              key={type}
              onClick={() => setTradeType(type)}
              className={`w-1/2 py-3 rounded-xl transition-all capitalize ${
                tradeType === type
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      )}
      {renderStageContent()}
    </div>
  );
};

export default NewTrade;
