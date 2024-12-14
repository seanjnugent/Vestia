import React from 'react';
import { useParams } from 'react-router-dom';

const Account = () => {
  const { id } = useParams();

  // Mock account details
  const accountDetails = {
    id,
    name: `Account ${id}`,
    type: 'Savings',
    value: '£12,340',
    details: 'This is a detailed description of the account.',
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {accountDetails.name}
      </h1>
      <div className="bg-white p-6 shadow-md rounded-lg">
        <p className="text-gray-700">
          <strong>Type:</strong> {accountDetails.type}
        </p>
        <p className="text-gray-700">
          <strong>Value:</strong> {accountDetails.value}
        </p>
        <p className="text-gray-700 mt-4">{accountDetails.details}</p>
      </div>
    </div>
  );
};

export default Account;
