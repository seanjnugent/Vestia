import React, { useState, useCallback, useMemo } from 'react';
import { Check, ChevronLeft, ChevronRight, DollarSign } from 'lucide-react';

const AnimatedProgressBar = ({ currentStep }) => {
  const progress = (currentStep / 5) * 100;

  return (
    <div className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 h-1.5 rounded-full overflow-hidden">
      <div
        className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full transition-all duration-300 ease-in-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

const StepButton = ({ children, onClick, disabled = false, variant = 'primary' }) => {
  const variantStyles = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    accent: 'bg-green-500 hover:bg-green-600 text-white',
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

const NewAccount = () => {
  const [step, setStep] = useState(1);
  const [account, setAccount] = useState({
    type: '',
    portfolioType: '',
    name: '',
    depositAmount: '',
    recurringPayment: {
      amount: '',
      frequency: 'monthly',
      startDate: new Date(),
    },
    bankAccount: '',
  });

  const bankAccounts = useMemo(() => [
    { name: 'Bank of England', number: '1234' },
    { name: 'HSBC', number: '5678' },
  ], []);

  const updateAccount = useCallback((updates) => {
    setAccount((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleNext = useCallback(() => {
    if (step < 5) {
      setStep((prev) => prev + 1);
    } else {
      alert('Account Created Successfully!');
    }
  }, [step]);

  const handleBack = useCallback(() => {
    if (step > 1) setStep((prev) => prev - 1);
  }, [step]);

  const renderStepContent = () => {
    const stepComponents = {
      1: (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Select Account Type</h2>
          <div className="grid grid-cols-2 gap-4">
            {['Managed Portfolio', 'General Investment'].map((type) => (
              <button
                key={type}
                onClick={() => {
                  updateAccount({ type });
                  handleNext();
                }}
                className={`
                  py-4 rounded-xl border-2 transition-all duration-300
                  ${account.type === type
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                    : 'border-gray-300 text-gray-600 hover:border-gray-500'}
                `}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      ),
      2: account.type === 'Managed Portfolio' ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Select Portfolio Type</h2>
          <div className="grid grid-cols-3 gap-4">
            {['Aggressive', 'Mid', 'Cautious'].map((portfolio) => (
              <button
                key={portfolio}
                onClick={() => {
                  updateAccount({ portfolioType: portfolio });
                  handleNext();
                }}
                className={`
                  py-4 rounded-xl border-2 transition-all duration-300
                  ${account.portfolioType === portfolio
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                    : 'border-gray-300 text-gray-600 hover:border-gray-500'}
                `}
              >
                {portfolio}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Name Your Account</h2>
          <input
            type="text"
            value={account.name}
            onChange={(e) => updateAccount({ name: e.target.value })}
            className="w-full py-3 px-4 border-2 rounded-xl focus:outline-none focus:border-indigo-500"
            placeholder="Enter account name"
          />
        </div>
      ),
      3: (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Make an Initial Deposit</h2>
          <input
            type="number"
            value={account.depositAmount}
            onChange={(e) => updateAccount({ depositAmount: e.target.value })}
            className="w-full py-3 px-4 border-2 rounded-xl focus:outline-none focus:border-indigo-500"
            placeholder="Enter deposit amount"
          />
        </div>
      ),
      4: (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Recurring Payments</h2>
          <div className="space-y-4">
            <label>
              Amount:
              <input
                type="number"
                value={account.recurringPayment.amount}
                onChange={(e) =>
                  updateAccount({
                    recurringPayment: {
                      ...account.recurringPayment,
                      amount: e.target.value,
                    },
                  })
                }
                className="w-full py-3 px-4 border-2 rounded-xl focus:outline-none focus:border-indigo-500"
                placeholder="Enter monthly payment amount"
              />
            </label>
            <label>
              Frequency:
              <select
                value={account.recurringPayment.frequency}
                onChange={(e) =>
                  updateAccount({
                    recurringPayment: {
                      ...account.recurringPayment,
                      frequency: e.target.value,
                    },
                  })
                }
                className="w-full py-3 px-4 border-2 rounded-xl focus:outline-none focus:border-indigo-500"
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annually">Annually</option>
              </select>
            </label>
            <label>
              Start Date:
              <input
                type="date"
                value={account.recurringPayment.startDate.toISOString().slice(0, 10)}
                onChange={(e) =>
                  updateAccount({
                    recurringPayment: {
                      ...account.recurringPayment,
                      startDate: new Date(e.target.value),
                    },
                  })
                }
                className="w-full py-3 px-4 border-2 rounded-xl focus:outline-none focus:border-indigo-500"
              />
            </label>
          </div>
        </div>
      ),
      5: (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Select Bank Account</h2>
          <select
            value={account.bankAccount}
            onChange={(e) => updateAccount({ bankAccount: e.target.value })}
            className="w-full py-3 px-4 border-2 rounded-xl focus:outline-none focus:border-indigo-500"
          >
            <option value="">Select a bank account</option>
            {bankAccounts.map((acc) => (
              <option key={acc.name} value={acc.name}>
                {acc.name} (**** {acc.number})
              </option>
            ))}
          </select>
        </div>
      ),
    };

    return stepComponents[step] || null;
  };

  const isStepComplete = () => {
    if (step === 2) {
      return account.name.trim().length > 0; // Make sure account name is not empty
    }
    return true; // All other steps are valid by default
  };

  return (
    <div className="flex justify-center py-6 px-4">
      <div className="max-w-lg w-full bg-white shadow-lg rounded-xl p-8 space-y-6">
        <AnimatedProgressBar currentStep={step} />
        <div>{renderStepContent()}</div>
        <div className="flex justify-between">
          <StepButton onClick={handleBack} disabled={step === 1} variant="secondary">
            <ChevronLeft /> Back
          </StepButton>
          <StepButton onClick={handleNext} disabled={!isStepComplete()} variant="primary">
            {step === 5 ? 'Finish' : 'Next'} <ChevronRight />
          </StepButton>
        </div>
      </div>
    </div>
  );
};

export default NewAccount;
