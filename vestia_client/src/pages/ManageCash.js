import React, { useState } from "react";

const ManageCash = () => {
  const [step, setStep] = useState(1);
  const [action, setAction] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [amount, setAmount] = useState("");
  const [bankAccount, setBankAccount] = useState("");

  const accounts = [
    { name: "Investment Account", cash: 1500 },
    { name: "Savings Account", cash: 800 },
  ];

  const bankAccounts = ["Bank of England - 1234", "HSBC - 5678"];

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const progress = (step / 5) * 100;

  return (
    <div className="p-6 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-indigo-700">
          Manage Cash
        </h1>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Steps */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-lg font-semibold text-gray-700">Select Action:</p>
            <div className="space-y-2">
              <button
                className={`w-full py-3 px-4 rounded-lg border text-left ${
                  action === "deposit"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-50 border-gray-300"
                }`}
                onClick={() => setAction("deposit")}
              >
                Deposit Cash
              </button>
              <button
                className={`w-full py-3 px-4 rounded-lg border text-left ${
                  action === "withdraw"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-50 border-gray-300"
                }`}
                onClick={() => setAction("withdraw")}
              >
                Withdraw Cash
              </button>
            </div>
            <button
              onClick={handleNext}
              disabled={!action}
              className="w-full py-3 px-6 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <p className="text-lg font-semibold text-gray-700">
              Select Account:
            </p>
            <div className="space-y-2">
              {accounts.map((acc, index) => (
                <button
                  key={index}
                  className={`w-full py-3 px-4 rounded-lg border text-left ${
                    selectedAccount === acc.name
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-50 border-gray-300"
                  }`}
                  onClick={() => setSelectedAccount(acc.name)}
                >
                  {acc.name} - £{acc.cash}
                </button>
              ))}
            </div>
            <div className="flex justify-between mt-4">
              <button
                onClick={handleBack}
                className="py-3 px-6 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={!selectedAccount}
                className="py-3 px-6 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <p className="text-lg font-semibold text-gray-700">Enter Amount:</p>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full py-3 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              placeholder="Enter amount"
            />
            <div className="flex justify-between mt-4">
              <button
                onClick={handleBack}
                className="py-3 px-6 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={!amount}
                className="py-3 px-6 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <p className="text-lg font-semibold text-gray-700">
              Select Bank Account:
            </p>
            <div className="space-y-2">
              {bankAccounts.map((acc, index) => (
                <button
                  key={index}
                  className={`w-full py-3 px-4 rounded-lg border text-left ${
                    bankAccount === acc
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-50 border-gray-300"
                  }`}
                  onClick={() => setBankAccount(acc)}
                >
                  {acc}
                </button>
              ))}
            </div>
            <div className="flex justify-between mt-4">
              <button
                onClick={handleBack}
                className="py-3 px-6 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={!bankAccount}
                className="py-3 px-6 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <p className="text-lg font-semibold text-gray-700">
              Confirm Transaction:
            </p>
            <ul className="text-gray-700 space-y-2">
              <li>Action: {action === "deposit" ? "Deposit" : "Withdraw"}</li>
              <li>Account: {selectedAccount}</li>
              <li>Amount: £{amount}</li>
              <li>Bank Account: {bankAccount}</li>
            </ul>
            <div className="flex justify-between mt-4">
              <button
                onClick={handleBack}
                className="py-3 px-6 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Back
              </button>
              <button
                onClick={() => alert("Transaction Submitted!")}
                className="py-3 px-6 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCash;
