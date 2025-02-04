import React, { useState } from 'react';
import { Check, X, CreditCard, Building2, ChevronRight } from 'lucide-react';

const NewBankAccount = () => {
  const [country, setCountry] = useState('UK');
  const [accountType, setAccountType] = useState('bank');
  const [details, setDetails] = useState({
    iban: '',
    sortCode: '',
    accountNumber: '',
    cardNumber: '',
    expiryDate: '',
    securityCode: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [validationStatus, setValidationStatus] = useState(null);
  const [activeSection, setActiveSection] = useState('type');

  const handleInputChange = (e) => {
    setDetails({
      ...details,
      [e.target.name]: e.target.value
    });
  };

  const validateAccount = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setValidationStatus('Validated');
    }, 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting account details:', { country, accountType, details });
  };

  const accountTypes = [
    {
      id: 'bank',
      title: 'Bank Account',
      icon: Building2,
      description: 'Connect your bank account for deposits and withdrawals',
      gradient: 'from-purple-600 to-blue-500'
    },
    {
      id: 'card',
      title: 'Debit Card',
      icon: CreditCard,
      description: 'Add a debit card for quick payments',
      gradient: 'from-red-600 to-pink-500'
    }
  ];

  const renderFormSection = () => {
    return (
      <div className="space-y-6 bg-gray-900 p-8 rounded-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="block text-gray-300 text-sm font-medium">Country</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              {['UK', 'US', 'Ireland', 'France', 'Germany', 'Spain', 'Ukraine'].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {['UK', 'Ireland', 'France', 'Germany', 'Spain'].includes(country) && (
            <div className="space-y-4">
              <label className="block text-gray-300 text-sm font-medium">IBAN</label>
              <input
                type="text"
                name="iban"
                value={details.iban}
                onChange={handleInputChange}
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          )}

          {country === 'UK' && (
            <>
              <div className="space-y-4">
                <label className="block text-gray-300 text-sm font-medium">Sort Code</label>
                <input
                  type="text"
                  name="sortCode"
                  value={details.sortCode}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div className="space-y-4">
                <label className="block text-gray-300 text-sm font-medium">Account Number</label>
                <input
                  type="text"
                  name="accountNumber"
                  value={details.accountNumber}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </>
          )}

          {accountType === 'card' && (
            <>
              <div className="space-y-4">
                <label className="block text-gray-300 text-sm font-medium">Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={details.cardNumber}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div className="space-y-4">
                <label className="block text-gray-300 text-sm font-medium">Expiry Date</label>
                <input
                  type="text"
                  name="expiryDate"
                  placeholder="MM/YY"
                  value={details.expiryDate}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div className="space-y-4">
                <label className="block text-gray-300 text-sm font-medium">Security Code</label>
                <input
                  type="text"
                  name="securityCode"
                  value={details.securityCode}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </>
          )}
        </div>

        <div className="flex gap-4 mt-8">
          <button
            type="button"
            onClick={validateAccount}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            {isLoading ? 'Validating...' : 'Validate'}
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Add Account
          </button>
        </div>

        {validationStatus && (
          <div className="flex items-center gap-2 text-green-400">
            <Check className="w-5 h-5" />
            <span>{validationStatus}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative h-64">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
        
        <div className="relative z-20 max-w-7xl mx-auto py-24 px-6 lg:px-8">
          <h1 className="text-6xl font-bold mb-4">Add Payment Method</h1>
          <p className="text-2xl text-gray-300">Connect your accounts securely</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-32 relative z-30">
        <form onSubmit={handleSubmit} className="space-y-8">
          {activeSection === 'type' ? (
            <div className="grid grid-cols-2 gap-6">
              {accountTypes.map((type) => (
                <div
                  key={type.id}
                  onClick={() => {
                    setAccountType(type.id);
                    setActiveSection('form');
                  }}
                  className="relative rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-105 cursor-pointer"
                >
                  <div className={`relative h-48 bg-gradient-to-br ${type.gradient}`}>
                    <div className="absolute inset-0 p-6 flex flex-col justify-between">
                      <div>
                        <type.icon className="w-12 h-12" />
                        <h3 className="text-2xl font-bold mt-4">{type.title}</h3>
                        <p className="text-sm text-gray-200 mt-2">{type.description}</p>
                      </div>
                      <ChevronRight className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            renderFormSection()
          )}
        </form>
      </div>
    </div>
  );
};

export default NewBankAccount;