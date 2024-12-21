import React, { useState, useCallback, useMemo } from 'react';
import { Check, ChevronLeft, ChevronRight, DollarSign } from 'lucide-react';

const AnimatedProgressBar = ({ currentStep }) => {
  const progress = (currentStep / 5) * 100;

  return (
    <div className="h-2 rounded-full overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600">
      <div
        className={`h-full bg-gradient-to-r from-teal-400 to-emerald-400 transition-all duration-300 ease-in-out w-${progress}%`}
      />
    </div>
  );
};

const StepButton = ({ children, onClick, disabled = false, variant = 'primary' }) => {
  const variantStyles = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 py-2 px-4 rounded-full flex items-center gap-2 transition-all duration-300 ease-in-out',
    secondary: 'text-gray-600 hover:text-gray-700 focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 py-2 px-4 rounded-full flex items-center gap-2 transition-all duration-300 ease-in-out',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${variantStyles[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
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

  const isStepComplete = () => {
    if (step === 2) {
      return account.name.trim().length > 0; // Make sure account name is not empty
    }
    return true; // All other steps are valid by default
  };

  const renderStepContent = () => {
    const stepComponents = {
      1: (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">Select Account Type</h2>
          <div className="grid grid-cols-2 gap-4">
            {['Managed Portfolio', 'General Investment'].map((type) => (
              <button
                key={type}
                onClick={() => {
                  updateAccount({ type });
                  handleNext();
                }}
                className={`
                  py-3 px-6 rounded-full bg-white shadow-md border border-gray-200 hover:shadow-lg hover:border-indigo-500 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-gray-700 font-medium transition-all duration-300 ease-in-out ${
                  account.type === type ? 'bg-indigo-50 text-indigo-600' : ''
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      ),
      2: account.type === 'Managed Portfolio' ? (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">Select Portfolio Type</h2>
          <div className="grid grid-cols-3 gap-4">
            {['Aggressive', 'Mid', 'Cautious'].map((portfolio) => (
              <button
                key={portfolio}
                onClick={() => {
                  updateAccount({ portfolioType: portfolio });
                  handleNext();
                }}
                className={`
                  py-3 px-6 rounded-full bg-white shadow-md border border-gray-200 hover:shadow-lg hover:border-indigo-500 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-gray-700 font-medium transition-all duration-300 ease-in-out ${
                  account.portfolioType === portfolio ? 'bg-indigo-50 text-indigo-600' : ''
                }`}
              >
                {portfolio}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">Name Your Account</h2>
          <input
            type="text"
            value={account.name}
            onChange={(e) => updateAccount({ name: e.target.value })}
            className="w-full py-3 px-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            placeholder="Enter account name"
          />
        </div>
      ),
      3: (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">Make an Initial Deposit</h2>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <DollarSign className="w-5 h-5 text-gray-400" />
            </div>
            <input
                type="number"
                value={account.depositAmount}
                onChange={(e) => updateAccount({ depositAmount: e.target.value })}
                className="w-full py-3 pl-10 pr-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder="Enter deposit amount"
            />
          </div>
        </div>
      ),
      4: (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">Recurring Payments</h2>
          <div className="space-y-4">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <DollarSign className="w-5 h-5 text-gray-400" />
                </div>
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
                    className="w-full py-3 pl-10 pr-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    placeholder="Enter monthly payment amount"
                />
            </div>
            <label className="block text-gray-700">
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
                className="mt-1 w-full py-3 px-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annually">Annually</option>
              </select>
            </label>
            <label className="block text-gray-700">
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
                className="mt-1 w-full py-3 px-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </label>
          </div>
        </div>
      ),
      5: (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">Select Bank Account</h2>
          <select
            value={account.bankAccount}
            onChange={(e) => updateAccount({ bankAccount: e.target.value })}
            className="w-full py-3 px-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
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
