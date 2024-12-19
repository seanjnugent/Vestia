import React, { useState, useCallback, useMemo } from "react";
import { 
  CreditCard, 
  ArrowRightLeft, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  DollarSign,
  Landmark,
  CreditCardIcon,
  Wallet,
  Activity,
  Send,
  PiggyBank,
  QrCode
} from "lucide-react";

// Animated Progress Indicator
const AnimatedProgressIndicator = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      {steps.map((step, index) => (
        <div 
          key={index} 
          className="flex flex-col items-center group"
        >
          <div 
            className={`
              w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
              ${index < currentStep 
                ? 'bg-blue-500 text-white' 
                : index === currentStep 
                  ? 'bg-blue-100 text-blue-600 ring-4 ring-blue-200' 
                  : 'bg-gray-200 text-gray-500'}
            `}
          >
            {step.icon}
          </div>
          <span 
            className={`
              text-xs mt-2 transition-all duration-300
              ${index < currentStep 
                ? 'text-blue-600' 
                : index === currentStep 
                  ? 'text-blue-700 font-semibold' 
                  : 'text-gray-500'}
            `}
          >
            {step.label}
          </span>
        </div>
      ))}
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
    bankAccount: "",
    additionalDetails: {}
  });

  // Enhanced step definitions with icons
  const steps = [
    { label: "Type", icon: <Activity size={20} /> },
    { label: "Method", icon: <CreditCard size={20} /> },
    { label: "Amount", icon: <DollarSign size={20} /> },
    { label: "Source", icon: <Landmark size={20} /> },
    { label: "Review", icon: <Check size={20} /> }
  ];

  // Enhanced accounts with more context
  const accounts = useMemo(() => [
    { 
      name: "Trading Account", 
      cash: 15000, 
      type: "investment",
      icon: <CreditCard className="text-blue-600" /> 
    },
    { 
      name: "Cash Reserve", 
      cash: 8000, 
      type: "savings",
      icon: <PiggyBank className="text-green-600" /> 
    }
  ], []);

  // Enhanced payment methods with more options
  const paymentMethods = [
    { 
      name: "Bank Transfer", 
      icon: <ArrowRightLeft className="text-blue-600" />,
      processingTime: "1-3 business days"
    },
    { 
      name: "Credit/Debit Card", 
      icon: <CreditCardIcon className="text-purple-600" />,
      processingTime: "Instant"
    },
    { 
      name: "Mobile Wallet", 
      icon: <Wallet className="text-green-600" />,
      processingTime: "Instant"
    },
    { 
      name: "Crypto Transfer", 
      icon: <QrCode className="text-orange-600" />,
      processingTime: "30-60 minutes"
    }
  ];

  // Bank accounts for withdrawals/deposits
  const bankAccounts = useMemo(() => [
    { 
      name: "Personal Checking", 
      bank: "Chase Bank", 
      number: "1234", 
      icon: <Landmark className="text-blue-600" /> 
    },
    { 
      name: "Business Account", 
      bank: "Wells Fargo", 
      number: "5678", 
      icon: <Send className="text-green-600" /> 
    }
  ], []);

  // Update transaction state
  const updateTransaction = useCallback((updates) => {
    setTransaction(prev => ({ ...prev, ...updates }));
  }, []);

  // Navigation helpers
  const handleNext = useCallback(() => {
    if (step < steps.length) setStep(prev => prev + 1);
  }, [step, steps.length]);

  const handleBack = useCallback(() => {
    if (step > 1) setStep(prev => prev - 1);
  }, [step]);

  // Render step content dynamically
  const renderStepContent = () => {
    const stepComponents = {
      1: (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Select Transaction Type</h2>
          <div className="grid grid-cols-2 gap-4">
            {["deposit", "withdraw"].map(type => (
              <button
                key={type}
                onClick={() => {
                  updateTransaction({ type });
                  handleNext();
                }}
                className={`
                  py-4 rounded-xl border-2 transition-all duration-300
                  flex items-center justify-center gap-3 text-lg
                  ${transaction.type === type 
                    ? "bg-blue-50 border-blue-500 text-blue-700" 
                    : "border-gray-300 text-gray-600 hover:border-gray-500"}
                `}
              >
                {type === "deposit" ? "💰 Deposit Funds" : "💸 Withdraw Funds"}
              </button>
            ))}
          </div>
        </div>
      ),
      2: (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Select Payment Method</h2>
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <button
                key={method.name}
                onClick={() => {
                  updateTransaction({ method: method.name });
                  handleNext();
                }}
                className={`
                  w-full py-4 rounded-xl border-2 flex items-center justify-between 
                  transition-all duration-300 text-left
                  ${transaction.method === method.name 
                    ? "bg-blue-50 border-blue-500 text-blue-700" 
                    : "border-gray-300 text-gray-600 hover:border-gray-500"}
                `}
              >
                <div className="flex items-center gap-4">
                  {method.icon}
                  <div>
                    <span className="font-semibold">{method.name}</span>
                    <p className="text-xs text-gray-500">
                      Processing: {method.processingTime}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
          <div className="flex justify-between mt-4">
            <button 
              onClick={handleBack} 
              className="text-gray-500 hover:text-gray-700 flex items-center"
            >
              <ChevronLeft /> Back
            </button>
          </div>
        </div>
      ),
      3: (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Enter Amount</h2>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              value={transaction.amount}
              onChange={(e) => updateTransaction({ amount: e.target.value })}
              className="
                w-full py-4 pl-8 pr-4 border-2 rounded-xl 
                focus:outline-none focus:border-blue-500 text-lg
              "
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>
          <div className="flex justify-between mt-4">
            <button 
              onClick={handleBack} 
              className="text-gray-500 hover:text-gray-700 flex items-center"
            >
              <ChevronLeft /> Back
            </button>
            <button
              onClick={handleNext}
              disabled={!transaction.amount}
              className={`
                py-2 px-6 rounded-xl transition-all duration-300
                ${transaction.amount 
                  ? 'bg-blue-500 text-white hover:bg-blue-600' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
              `}
            >
              Next <ChevronRight />
            </button>
          </div>
        </div>
      ),
      4: (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Select Source Account</h2>
          <div className="space-y-3">
            {accounts.map((acc) => (
              <button
                key={acc.name}
                onClick={() => {
                  updateTransaction({ 
                    account: acc.name,
                    additionalDetails: { type: acc.type }
                  });
                  handleNext();
                }}
                className={`
                  w-full py-4 rounded-xl border-2 flex items-center justify-between 
                  transition-all duration-300
                  ${transaction.account === acc.name 
                    ? "bg-blue-50 border-blue-500 text-blue-700" 
                    : "border-gray-300 text-gray-600 hover:border-gray-500"}
                `}
              >
                <div className="flex items-center gap-4">
                  {acc.icon}
                  <div>
                    <span className="font-semibold">{acc.name}</span>
                    <p className="text-xs text-gray-500 capitalize">{acc.type} Account</p>
                  </div>
                </div>
                <span className="font-bold">$${acc.cash.toLocaleString()}</span>
              </button>
            ))}
          </div>
          <div className="flex justify-between mt-4">
            <button 
              onClick={handleBack} 
              className="text-gray-500 hover:text-gray-700 flex items-center"
            >
              <ChevronLeft /> Back
            </button>
          </div>
        </div>
      ),
      5: (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Confirm Transaction</h2>
          <div className="bg-gray-50 p-6 rounded-xl space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(transaction).map(([key, value]) => {
                if (!value || key === 'additionalDetails') return null;
                return (
                  <div 
                    key={key} 
                    className="border-b pb-2 flex justify-between"
                  >
                    <span className="text-gray-600 capitalize">{key}:</span>
                    <span className="font-semibold text-gray-800">{value}</span>
                  </div>
                );
              })}
            </div>
            <div className="text-sm text-gray-500 bg-white p-3 rounded-lg">
              <p>⚠️ Please review all details carefully before confirming.</p>
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <button 
              onClick={handleBack} 
              className="text-gray-500 hover:text-gray-700 flex items-center"
            >
              <ChevronLeft /> Back
            </button>
            <button 
              onClick={() => alert("Transaction Processed Successfully! 🎉")} 
              className="
                bg-green-500 text-white py-3 px-6 rounded-xl 
                hover:bg-green-600 transition-all duration-300
                flex items-center gap-2
              "
            >
              <Check /> Confirm Transaction
            </button>
          </div>
        </div>
      )
    };

    return stepComponents[step] || null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl overflow-hidden">
        <div className="p-8">
          <h1 className="text-4xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            Cash Management
          </h1>
          
          <AnimatedProgressIndicator 
            steps={steps} 
            currentStep={step - 1} 
          />
          
          <div className="mt-6 space-y-4">
            {renderStepContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageCash;