import React, { useState, useCallback, useMemo } from "react";
import { 
  CreditCard, 
  ArrowRightLeft, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  DollarSign 
} from "lucide-react";

const AnimatedProgressBar = ({ currentStep }) => {
  // Calculate progress based on current step directly
  const progress = (currentStep / 5) * 100;

  return (
    <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
      <div 
        className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full transition-all duration-300 ease-in-out" 
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

const StepButton = ({ children, onClick, disabled = false, variant = "primary" }) => {
  const variantStyles = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    accent: "bg-green-500 hover:bg-green-600 text-white"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center justify-center gap-2 py-3 px-6 rounded-xl 
        transition-all duration-300 ease-in-out
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
      `}
    >
      {children}
    </button>
  );
};

const ManageCashModern = () => {
  const [step, setStep] = useState(1);
  const [transaction, setTransaction] = useState({
    type: "",
    account: null,
    amount: "",
    bankAccount: ""
  });

  const accounts = useMemo(() => [
    { 
      name: "Investment Account", 
      cash: 1500, 
      icon: <CreditCard className="text-indigo-600" /> 
    },
    { 
      name: "Savings Account", 
      cash: 800, 
      icon: <DollarSign className="text-green-600" /> 
    }
  ], []);

  const bankAccounts = useMemo(() => [
    { 
      name: "Bank of England", 
      number: "1234", 
      icon: <ArrowRightLeft className="text-blue-600" /> 
    },
    { 
      name: "HSBC", 
      number: "5678", 
      icon: <ArrowRightLeft className="text-green-600" /> 
    }
  ], []);

  const updateTransaction = useCallback((updates) => {
    setTransaction(prev => ({ ...prev, ...updates }));
  }, []);

  const handleNext = useCallback(() => {
    if (step < 5) setStep(prev => prev + 1);
  }, [step]);

  const handleBack = useCallback(() => {
    if (step > 1) setStep(prev => prev - 1);
  }, [step]);

  const renderStepContent = () => {
    const stepComponents = {
      1: (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Select Transaction Type</h2>
          <div className="grid grid-cols-2 gap-4">
            {["deposit", "withdraw"].map(type => (
              <button
                key={type}
                onClick={() => {
                  updateTransaction({ type });
                  handleNext(); // Automatically move to next step
                }}
                className={`
                  py-4 rounded-xl border-2 transition-all duration-300
                  flex items-center justify-center gap-3
                  ${transaction.type === type 
                    ? "bg-indigo-50 border-indigo-500 text-indigo-700" 
                    : "border-gray-300 text-gray-600 hover:border-gray-500"}
                `}
              >
                {type === "deposit" ? "💰 Deposit" : "💸 Withdraw"}
              </button>
            ))}
          </div>
        </div>
      ),
      2: (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Select Account</h2>
          <div className="space-y-2">
            {accounts.map((acc) => (
              <button
                key={acc.name}
                onClick={() => {
                  updateTransaction({ account: acc.name });
                  handleNext();
                }}
                className={`
                  w-full py-4 rounded-xl border-2 flex items-center justify-between 
                  transition-all duration-300
                  ${transaction.account === acc.name 
                    ? "bg-indigo-50 border-indigo-500 text-indigo-700" 
                    : "border-gray-300 text-gray-600 hover:border-gray-500"}
                `}
              >
                <div className="flex items-center gap-3">
                  {acc.icon}
                  {acc.name}
                </div>
                <span>£{acc.cash}</span>
              </button>
            ))}
          </div>
          <div className="flex justify-between">
            <StepButton onClick={handleBack} variant="secondary">
              <ChevronLeft /> Back
            </StepButton>
          </div>
        </div>
      ),
      3: (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Enter Amount</h2>
          <input
            type="number"
            value={transaction.amount}
            onChange={(e) => updateTransaction({ amount: e.target.value })}
            className="w-full py-3 px-4 border-2 rounded-xl focus:outline-none focus:border-indigo-500"
            placeholder="Enter amount"
          />
          <div className="flex justify-between">
            <StepButton onClick={handleBack} variant="secondary">
              <ChevronLeft /> Back
            </StepButton>
            <StepButton 
              onClick={handleNext}
              disabled={!transaction.amount}
            >
              Next <ChevronRight />
            </StepButton>
          </div>
        </div>
      ),
      4: (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Select Bank Account</h2>
          <div className="space-y-2">
            {bankAccounts.map((acc) => (
              <button
                key={acc.name}
                onClick={() => {
                  updateTransaction({ bankAccount: acc.name });
                  handleNext();
                }}
                className={`
                  w-full py-4 rounded-xl border-2 flex items-center justify-between 
                  transition-all duration-300
                  ${transaction.bankAccount === acc.name 
                    ? "bg-indigo-50 border-indigo-500 text-indigo-700" 
                    : "border-gray-300 text-gray-600 hover:border-gray-500"}
                `}
              >
                <div className="flex items-center gap-3">
                  {acc.icon}
                  {acc.name}
                </div>
                <span>**** {acc.number}</span>
              </button>
            ))}
          </div>
          <div className="flex justify-between">
            <StepButton onClick={handleBack} variant="secondary">
              <ChevronLeft /> Back
            </StepButton>
          </div>
        </div>
      ),
      5: (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Confirm Transaction</h2>
          <div className="bg-gray-50 p-4 rounded-xl space-y-2">
            {Object.entries(transaction).map(([key, value]) => (
              value && (
                <div 
                  key={key} 
                  className="flex justify-between text-gray-700 border-b last:border-b-0 pb-2 last:pb-0"
                >
                  <span className="capitalize">{key}:</span>
                  <span className="font-medium">{value}</span>
                </div>
              )
            ))}
          </div>
          <div className="flex justify-between">
            <StepButton onClick={handleBack} variant="secondary">
              <ChevronLeft /> Back
            </StepButton>
            <StepButton 
              onClick={() => alert("Transaction Complete! 🎉")} 
              variant="accent"
            >
              <Check /> Submit
            </StepButton>
          </div>
        </div>
      )
    };

    return stepComponents[step] || null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            Cash Management
          </h1>
          
          <AnimatedProgressBar currentStep={step} />
          
          <div className="mt-6 space-y-4">
            {renderStepContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageCashModern;