import React, { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProgressTracker from '../components/ProgressTracker';
import ManagedPortfolioList from '../components/ManagedPortfolioList';
import ManagedPortfolioDetails from '../components/ManagedPortfolioDetails';
import ActionButton from '../components/ActionButton';

const NewAccount = () => {
  const [step, setStep] = useState(1);
  const [account, setAccount] = useState({
    type: '',
    portfolioType: '',
    name: '',
    managedPortfolio: null,
  });

  const updateAccount = useCallback((updates) => {
    console.log('Updating account:', updates);
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
      return account.portfolioType !== '';
    }
    if (step === 3 || step === 4) {
      return account.name && account.name.trim().length > 0;
    }
    return true;
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {['General Investment Account', 'Individual Savings Account (ISA)', 'SIPP/Pension'].map((type) => (
              <button
                key={type}
                onClick={() => {
                  updateAccount({ type });
                  handleNext();
                }}
                className={`w-full py-4 px-6 rounded-lg shadow-md transition-all duration-300 
                  ${account.type === type ? 'bg-indigo-500 text-white' : 'bg-white text-gray-800 border border-gray-300 hover:bg-indigo-50'}
                `}
              >
                {type}
              </button>
            ))}
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">Portfolio Type</h2>
            <div className="grid grid-cols-2 gap-4">
              {['Managed', 'Non-Managed'].map((type) => (
                <button
                  key={type}
                  onClick={() => updateAccount({ portfolioType: type })}
                  className={`w-full py-4 px-6 rounded-lg shadow-md transition-all duration-300 
                    ${account.portfolioType === type ? 'bg-indigo-500 text-white' : 'bg-white text-gray-800 border border-gray-300 hover:bg-indigo-50'}
                  `}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        );
      case 3:
        return account.portfolioType === 'Managed' ? (
          <ManagedPortfolioList onSelectPortfolio={(portfolio) => updateAccount({ managedPortfolio: portfolio })} />
        ) : (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">Name Your Account</h2>
            <input
              type="text"
              value={account.name}
              onChange={(e) => updateAccount({ name: e.target.value })}
              className="w-full py-3 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none shadow-sm"
              placeholder="Enter account name"
            />
          </div>
        );
      case 4:
        return account.managedPortfolio ? (
          <ManagedPortfolioDetails portfolio={account.managedPortfolio} />
        ) : (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">Review Account Details</h2>
            <div className="bg-white p-5 rounded-lg shadow-sm">
              <p><strong>Name:</strong> {account.name}</p>
              <p><strong>Type:</strong> {account.type}</p>
              <p><strong>Portfolio:</strong> {account.portfolioType}</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex justify-center py-10 px-4 min-h-screen bg-gray-100">
      <div className="max-w-3xl w-full bg-white shadow-xl rounded-3xl p-10 space-y-6">
        <ProgressTracker currentStep={step} steps={['Type', 'Portfolio', 'Details', 'Review', 'Confirmation']} />
        <div>{renderStepContent()}</div>
        <div className="flex justify-between">
          <ActionButton
            onClick={handleBack}
            disabled={step === 1}
            icon={ChevronLeft}
            title="Back"
            description=""
            className="shadow-lg"
          />
          <ActionButton
            onClick={handleNext}
            disabled={!isStepComplete()}
            icon={ChevronRight}
            title={step === 5 ? 'Finish' : 'Next'}
            description=""
            className="shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default NewAccount;