// NewRegularPayment.jsx
import React, { useState } from "react";
import ProgressTracker from "../components/ProgressTracker";
import RegularDeposit from "../components/payments/RegularDeposit";
import RegularWithdrawal from "../components/payments/RegularWithdrawal";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";

const NewRegularPayment = () => {
  const [stage, setStage] = useState(0);
  const [account, setAccount] = useState("");
  const [paymentType, setPaymentType] = useState("regularDeposit");

  // Navigation handler
  const handleComplete = () => {
    window.location.href = '/home';  // Or however you handle navigation in your app
  };

  const accounts = [
    { id: "investment", name: "Investment Account", balance: 25000, type: "Margin", buyingPower: 50000 },
    { id: "retirement", name: "Retirement Account", balance: 15000, type: "401k", buyingPower: 30000 },
  ];

  const steps = ["Account", "Type", "Source", "Amount", "Assets", "Schedule"];

  const renderAccountSelection = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Account
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
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Select Transaction Type</h2>
            <div className="grid grid-cols-2 gap-6">
              {["regularDeposit", "regularWithdraw"].map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setPaymentType(type);
                    setStage(2);
                  }}
                  className={`py-4 rounded-lg border transition-all duration-300 
                    text-center text-base font-medium capitalize
                    ${paymentType === type 
                      ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-200' 
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'}`}
                >
                  {type} Funds
                </button>
              ))}
                          <button
          onClick={() => setStage(0)}
          className="text-gray-500 hover:text-gray-700 flex items-center"
        >
          <ChevronLeft className="mr-2" /> Back
        </button>
            </div>
          </div>
        );
      case 2:
      case 3:
      case 4:
        return paymentType === "regularDeposit" ? (
          <RegularDeposit
            stage={stage}
            setStage={setStage}
            account={accounts.find((acc) => acc.id === account)}
            onComplete={handleComplete}
          />
        ) : (
          <RegularWithdrawal
            stage={stage}
            setStage={setStage}
            account={accounts.find((acc) => acc.id === account)}
            onComplete={handleComplete}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-6 bg-white shadow-lg rounded-xl border border-gray-200">
      <ProgressTracker currentStep={stage + 1} steps={steps} />
      {renderStageContent()}
    </div>
  );
};

export default NewRegularPayment;

