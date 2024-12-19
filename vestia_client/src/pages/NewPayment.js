import React, { useState } from "react";
import { motion } from "framer-motion";
import BuyTrade from "../components/BuyTrade";
import SellTrade from "../components/SellTrade";
import ProgressTracker from "../components/ProgressTracker";

const NewTrade = () => {
  const [stage, setStage] = useState(0);
  const [account, setAccount] = useState("");
  const [tradeType, setTradeType] = useState("buy");

  const accounts = [
    { id: "investment", name: "Investment Account", balance: 25000, type: "Margin", buyingPower: 50000 },
    { id: "retirement", name: "Retirement Account", balance: 15000, type: "401k", buyingPower: 30000 },
  ];

  const steps = ["Account", "Asset", "Amount", "Review"];

  const renderAccountSelection = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Trading Account
        </label>
        <div className="space-y-3">
          {accounts.map((acc) => (
            <button
              key={acc.id}
              onClick={() => setAccount(acc.id)}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                account === acc.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg">{acc.name}</h3>
                  <p className="text-sm text-gray-500">{acc.type} Account</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">
                    ${acc.balance.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    Buying Power: ${acc.buyingPower.toLocaleString()}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      <button
        onClick={() => setStage(1)}
        disabled={!account}
        className={`w-full py-3 rounded-xl transition-all ${
          account
            ? "bg-blue-500 text-white hover:bg-blue-600"
            : "bg-gray-300 text-gray-500"
        }`}
      >
        Continue
      </button>
    </motion.div>
  );

  const renderStageContent = () => {
    switch (stage) {
      case 0:
        return renderAccountSelection();
      case 1:
      case 2:
      case 3:
        return tradeType === "buy" ? (
          <BuyTrade
            stage={stage}
            setStage={setStage}
            account={accounts.find((acc) => acc.id === account)}
          />
        ) : (
          <SellTrade
            stage={stage}
            setStage={setStage}
            account={accounts.find((acc) => acc.id === account)}
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
