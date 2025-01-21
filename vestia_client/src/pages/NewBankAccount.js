import React, { useState } from 'react';
import { Check, X } from 'lucide-react';

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

  const handleInputChange = (e) => {
    setDetails({
      ...details,
      [e.target.name]: e.target.value
    });
  };

  const validateAccount = async () => {
    setIsLoading(true);
    // Here you would check the format or call an API to validate. 
    // For now, we'll just simulate a delay and success
    setTimeout(() => {
      setIsLoading(false);
      setValidationStatus('Validated');
    }, 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting account details:', { country, accountType, details });
    // Here you would call the insert function
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      <h1 className="text-3xl font-semibold text-[#00836f]">Add New Bank Account</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="country" className="font-bold text-gray-700">Country</label>
          <select id="country" name="country" value={country} onChange={(e) => setCountry(e.target.value)} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#00836f] focus:border-[#00836f]">
            <option value="UK">UK</option>
            <option value="US">US</option>
            <option value="Ireland">Ireland</option>
            <option value="France">France</option>
            <option value="Germany">Germany</option>
            <option value="Spain">Spain</option>
            <option value="Ukraine">Ukraine</option>
          </select>
        </div>

        {['UK', 'Ireland', 'France', 'Germany', 'Spain'].includes(country) && (
          <div className="flex flex-col">
            <label htmlFor="iban" className="font-bold text-gray-700">IBAN</label>
            <input type="text" id="iban" name="iban" value={details.iban} onChange={handleInputChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#00836f] focus:border-[#00836f]" />
          </div>
        )}

        {country === 'UK' && (
          <>
            <div className="flex flex-col">
              <label htmlFor="sortCode" className="font-bold text-gray-700">Sort Code</label>
              <input type="text" id="sortCode" name="sortCode" value={details.sortCode} onChange={handleInputChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#00836f] focus:border-[#00836f]" />
            </div>
            <div className="flex flex-col">
              <label htmlFor="accountNumber" className="font-bold text-gray-700">Account Number</label>
              <input type="text" id="accountNumber" name="accountNumber" value={details.accountNumber} onChange={handleInputChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#00836f] focus:border-[#00836f]" />
            </div>
          </>
        )}

        {/* For all countries, option for debit card */}
        <div className="flex flex-col">
          <label htmlFor="cardNumber" className="font-bold text-gray-700">Card Number</label>
          <input type="text" id="cardNumber" name="cardNumber" value={details.cardNumber} onChange={handleInputChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#00836f] focus:border-[#00836f]" />
        </div>
        <div className="flex flex-col">
          <label htmlFor="expiryDate" className="font-bold text-gray-700">Expiry Date (MM/YY)</label>
          <input type="text" id="expiryDate" name="expiryDate" value={details.expiryDate} onChange={handleInputChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#00836f] focus:border-[#00836f]" />
        </div>
        <div className="flex flex-col">
          <label htmlFor="securityCode" className="font-bold text-gray-700">Security Code</label>
          <input type="text" id="securityCode" name="securityCode" value={details.securityCode} onChange={handleInputChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#00836f] focus:border-[#00836f]" />
        </div>

        <button type="button" onClick={validateAccount} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#00836f] hover:bg-[#00695b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00836f]">
          {isLoading ? 'Validating...' : 'Validate'}
        </button>
        {validationStatus && <p className="text-green-500">{validationStatus}</p>}

        <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#00836f] hover:bg-[#00695b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00836f]">
          Add Account
        </button>
      </form>
    </div>
  );
};

export default NewBankAccount;