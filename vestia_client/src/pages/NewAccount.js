import React, { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProgressTracker from '../components/ProgressTracker';
import ManagedPortfolioList from '../components/ManagedPortfolioList';
import ActionButton from '../components/ActionButton';
import ReviewSection from '../components/ReviewSection';
import { useNavigate } from 'react-router-dom';

const NewAccount = () => {
  const [step, setStep] = useState(1);
  const [account, setAccount] = useState({
    type: '',
    portfolioType: '',
    name: '',
    managedPortfolio: null,
  });

  const navigate = useNavigate();

  const updateAccount = useCallback((updates) => {
    setAccount((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleNext = useCallback(() => {
    if (step < 4) {
      setStep((prev) => prev + 1);
    } else {
      submitAccountData();
    }
  }, [step]);

  const handleBack = useCallback(() => {
    if (step > 1) setStep((prev) => prev - 1);
  }, [step]);

  const isStepComplete = () => {
    if (step === 2) {
      return account.portfolioType !== '';
    }
    if (step === 3) {
      return account.name || account.managedPortfolio;
    }
    return true;
  };

  const submitAccountData = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('User ID not found');
      }

      const response = await fetch('http://localhost:5000/api/accounts/postNewAccount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: userId,
          account_type: account.type,
          account_name: account.name || account.managedPortfolio?.managed_portfolio_name,
          managed_portfolio_id: account.managedPortfolio?.managed_portfolio_id || null,
        }),
      });

      const data = await response.json();
      console.log(data);
      alert('Account created successfully!');
      navigate('/home');
    } catch (error) {
      console.error(error);
      alert('Error creating account. Please try again.');
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {['General Investment Account', 'Individual Savings Account (ISA)', 'SIPP/Pension'].map((type) => (
              <button
                key={type}
                onClick={() => { updateAccount({ type }); handleNext(); }}
                className={`w-full py-3 px-6 rounded-lg text-center transition-colors duration-300
                ${account.type === type ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-indigo-100'}`}
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
                  className={`w-full py-3 px-6 rounded-lg text-center transition-colors duration-300
                  ${account.portfolioType === type ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-indigo-100'}`}
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
        return (
          <ReviewSection account={account} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex justify-center min-h-screen bg-gray-100 py-10">
      <div className="max-w-2xl w-full bg-white shadow-xl rounded-3xl p-8 space-y-6">
        <ProgressTracker currentStep={step} steps={['Type', 'Portfolio', 'Details', 'Review']} />
        <div>{renderStepContent()}</div>
        <div className="flex justify-between">
          <ActionButton
            onClick={handleBack}
            disabled={step === 1}
            icon={ChevronLeft}
            title="Back"
            className="w-1/2 max-w-xs bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50"
          />
          <ActionButton
            onClick={handleNext}
            disabled={!isStepComplete()}
            icon={ChevronRight}
            title={step === 4 ? 'Finish' : 'Next'}
            className="w-1/2 max-w-xs bg-indigo-600 text-white hover:bg-indigo-700"
          />
        </div>
      </div>
    </div>
  );
};

export default NewAccount;
