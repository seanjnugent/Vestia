import React, { useState, useCallback, useMemo } from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

const ProgressTracker = ({ currentStep }) => {
  const steps = [
    "Transaction Type",
    "Payment Method",
    "Amount",
    "Source",
    "Review"
  ];

  const numSteps = steps.length;

  if (numSteps === 0) {
    return null;
  }

  const currentStepBounded = Math.max(1, Math.min(currentStep, numSteps));
  const progress = numSteps > 1 ? ((currentStepBounded - 1) / (numSteps - 1)) * 100 : currentStepBounded === 1 ? 100 : 0;

  return (
    <div className="relative mb-8 px-4">
      <div className="w-full h-2 bg-gray-300 rounded-full">
        <div
          className="h-2 bg-gradient-to-r from-[#ff6b6b] via-[#ffa500] to-[#ffff00] rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between absolute top-0 left-0 right-0 -mt-6 w-full">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">

          </div>
        ))}
      </div>
    </div>
  );
};



const ManageCash = () => {
  const [step, setStep] = useState(1);
  const [transaction, setTransaction] = useState({
    type: "",
    method: "",
    account: null,
    amount: "",
    additionalDetails: {},
  });

  const steps = [
    { label: "Transaction Type" },
    { label: "Payment Method" },
    { label: "Amount" },
    { label: "Source" },
    { label: "Review" },
  ];

  const accounts = useMemo(
    () => [
      { name: "Trading Account", cash: 15000, type: "investment" },
      { name: "Cash Reserve", cash: 8000, type: "savings" },
    ],
    []
  );

  const paymentMethods = [
    { name: "Bank Transfer", processingTime: "1-3 business days" },
    { name: "Credit/Debit Card", processingTime: "Instant" },
    { name: "Mobile Wallet", processingTime: "Instant" },
    { name: "Crypto Transfer", processingTime: "30-60 minutes" },
  ];

  const updateTransaction = useCallback(
    (updates) => {
      setTransaction((prev) => ({ ...prev, ...updates }));
    },
    []
  );

  const handleNext = useCallback(() => {
    if (step < steps.length) setStep((prev) => prev + 1);
  }, [step, steps.length]);

  const handleBack = useCallback(() => {
    if (step > 1) setStep((prev) => prev - 1);
  }, [step]);

  const renderStepContent = () => {
    const stepComponents = {
      1: (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">Select Transaction Type</h2>
          <div className="grid grid-cols-2 gap-6">
            {["deposit", "withdraw"].map((type) => (
              <button
                key={type}
                onClick={() => {
                  updateTransaction({ type });
                  handleNext();
                }}
                className={`py-4 rounded-lg border transition-all duration-300 
                  text-center text-base font-medium
                  ${transaction.type === type 
                    ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-200' 
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'}`}
              >
                {type === "deposit" ? "Deposit Funds" : "Withdraw Funds"}
              </button>
            ))}
          </div>
        </div>
      ),
      2: (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">Select Payment Method</h2>
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <button
                key={method.name}
                onClick={() => {
                  updateTransaction({ method: method.name });
                  handleNext();
                }}
                className={`w-full py-4 px-4 rounded-lg border flex items-center justify-between 
                  transition-all duration-300 text-left
                  ${transaction.method === method.name 
                    ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-200' 
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'}`}
              >
                <div>
                  <span className="block font-semibold text-base">{method.name}</span>
                  <span className="block text-sm text-gray-500 mt-1">
                    Processing: {method.processingTime}
                  </span>
                </div>
              </button>
            ))}
          </div>
          <div className="flex justify-between mt-4">
            <button 
              onClick={handleBack} 
              className="text-gray-600 hover:text-gray-900 flex items-center text-sm"
            >
              <ChevronLeft className="mr-1 w-4 h-4" /> Back
            </button>
          </div>
        </div>
      ),
      3: (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">Enter Amount</h2>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-base">$</span>
            </div>
            <input
              type="number"
              value={transaction.amount}
              onChange={(e) => updateTransaction({ amount: e.target.value })}
              className="w-full py-3 pl-8 pr-4 border border-gray-300 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                text-base"
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>
          <div className="flex justify-between mt-4">
            <button 
              onClick={handleBack} 
              className="text-gray-600 hover:text-gray-900 flex items-center text-sm"
            >
              <ChevronLeft className="mr-1 w-4 h-4" /> Back
            </button>
            <button
              onClick={handleNext}
              disabled={!transaction.amount}
              className={`py-2 px-6 rounded-lg text-sm font-medium transition-all duration-300 
                ${transaction.amount 
                  ? 'bg-blue-500 text-white hover:bg-blue-600' 
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
            >
              Next <ChevronRight className="inline-block ml-1 w-4 h-4" />
            </button>
          </div>
        </div>
      ),
      4: (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">Select Source Account</h2>
          <div className="space-y-4">
            {accounts.map((acc) => (
              <button
                key={acc.name}
                onClick={() => {
                  updateTransaction({ account: acc.name });
                  handleNext();
                }}
                className={`w-full py-4 px-4 rounded-lg border flex items-center justify-between 
                  transition-all duration-300
                  ${transaction.account === acc.name 
                    ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-200' 
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'}`}
              >
                <div>
                  <span className="block font-semibold text-base">{acc.name}</span>
                  <span className="block text-sm text-gray-500 mt-1">
                    {acc.type} Account
                  </span>
                </div>
                <span className="font-bold text-base">${acc.cash.toLocaleString()}</span>
              </button>
            ))}
          </div>
          <div className="flex justify-between mt-4">
            <button 
              onClick={handleBack} 
              className="text-gray-600 hover:text-gray-900 flex items-center text-sm"
            >
              <ChevronLeft className="mr-1 w-4 h-4" /> Back
            </button>
          </div>
        </div>
      ),
      5: (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">Confirm Transaction</h2>
          <div className="bg-gray-50 p-6 rounded-lg space-y-4 border border-gray-200">
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(transaction).map(([key, value]) => {
                if (!value || key === 'additionalDetails') return null;
                return (
                  <div key={key} className="border-b pb-2 flex justify-between items-center">
                    <span className="text-gray-600 capitalize text-sm">{key}</span>
                    <span className="font-semibold text-base text-gray-900">{value}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <button 
              onClick={handleBack} 
              className="text-gray-600 hover:text-gray-900 flex items-center text-sm"
            >
              <ChevronLeft className="mr-1 w-4 h-4" /> Back
            </button>
            <button
              onClick={() => alert("Transaction Confirmed")}
              className="py-2 px-6 rounded-lg bg-blue-500 text-white 
                hover:bg-blue-600 transition-colors duration-300 
                flex items-center text-sm font-medium"
            >
              Confirm <Check className="inline-block ml-2 w-4 h-4" />
            </button>
          </div>
        </div>
      ),
    };

    return stepComponents[step];
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-6 bg-white shadow-lg rounded-xl border border-gray-200">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
        Manage Your Cash
      </h1>
      <ProgressTracker currentStep={step} totalSteps={steps.length} />
      {renderStepContent()}
    </div>
  );
};

export default ManageCash;
