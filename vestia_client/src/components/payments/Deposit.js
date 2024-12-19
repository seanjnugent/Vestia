import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Deposit = ({ stage, setStage, account, onComplete }) => {
  const [transaction, setTransaction] = useState({
    method: "",
    amount: "",
    source: null
  });

  const paymentMethods = [
    { id: "bank", name: "Bank Transfer", processingTime: "1-3 business days" },
    { id: "card", name: "Credit/Debit Card", processingTime: "Instant" },
    { id: "wallet", name: "Mobile Wallet", processingTime: "Instant" },
  ];

  const linkedAccounts = {
    bank: [
      { id: "bank1", name: "Chase Checking ****1234" },
      { id: "bank2", name: "Wells Fargo Savings ****5678" }
    ],
    card: [
      { id: "card1", name: "Visa ****9012" },
      { id: "card2", name: "Mastercard ****3456" }
    ],
    wallet: [
      { id: "wallet1", name: "Apple Pay" },
      { id: "wallet2", name: "Google Pay" }
    ]
  };

  const renderContent = () => {
    switch (stage) {
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Select Payment Method</h2>
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => {
                    setTransaction(prev => ({ ...prev, method: method.id }));
                    setStage(3);
                  }}
                  className="w-full p-4 rounded-lg border hover:border-blue-500 transition-all"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{method.name}</span>
                    <span className="text-sm text-gray-500">{method.processingTime}</span>
                  </div>
                </button>
              ))}
            </div>
            <button
          onClick={() => setStage(1)}
          className="text-gray-500 hover:text-gray-700 flex items-center"
        >
          <ChevronLeft className="mr-2" /> Back
        </button>
          </div>
          
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Enter Amount</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deposit Amount
              </label>
              <input
                type="number"
                value={transaction.amount}
                onChange={(e) => setTransaction(prev => ({ ...prev, amount: e.target.value }))}
                className="w-full p-3 border rounded-lg"
                placeholder="Enter amount"
                min="0"
              />
            </div>
            <button
              onClick={() => setStage(4)}
              disabled={!transaction.amount}
              className={`w-full py-3 rounded-xl transition-all ${
                transaction.amount
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-300 text-gray-500"
              }`}
            >
              Review Deposit
            </button>
            <button
          onClick={() => setStage(2)}
          className="text-gray-500 hover:text-gray-700 flex items-center"
        >
          <ChevronLeft className="mr-2" /> Back
        </button>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Review Deposit</h2>
            <div className="bg-gray-50 p-6 rounded-xl space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <span className="text-gray-600">Amount</span>
                <span className="font-semibold text-lg">${Number(transaction.amount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <span className="text-gray-600">To</span>
                <span className="font-medium">{account.name}</span>
              </div>
              <div className="flex justify-between items-center pb-4">
                <span className="text-gray-600">Method</span>
                <span className="font-medium">
                  {paymentMethods.find(m => m.id === transaction.method)?.name}
                </span>
              </div>
              <div className="pt-4">
                <button
                  onClick={onComplete}
                  className="w-full py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all"
                >
                  Confirm Deposit
                </button>
              </div>
            </div>
            <button
          onClick={() => setStage(3)}
          className="text-gray-500 hover:text-gray-700 flex items-center"
        >
          <ChevronLeft className="mr-2" /> Back
        </button>
          </div>
        );
      default:
        return null;
    }
  };

  return renderContent();
};

export default Deposit;