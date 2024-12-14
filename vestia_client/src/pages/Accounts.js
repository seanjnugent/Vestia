import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Accounts = () => {
  const navigate = useNavigate();

  // Example accounts data
  const accounts = [
    { id: 1, name: 'Savings Account', type: 'Savings', value: '£12,340' },
    { id: 2, name: 'Checking Account', type: 'Checking', value: '£4,560' },
    { id: 3, name: 'Investment Account', type: 'Investment', value: '£22,450' },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Accounts</h1>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
          onClick={() => alert('Create New Account Modal Coming Soon!')}
        >
          Create New Account
        </button>
      </div>
      <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-4 text-left font-medium text-gray-600">Account Name</th>
            <th className="p-4 text-left font-medium text-gray-600">Account Type</th>
            <th className="p-4 text-left font-medium text-gray-600">Account Value</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account, index) => (
            <tr
              key={account.id}
              className={`cursor-pointer ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
              onClick={() => navigate(`/account/${account.id}`)}
            >
              <td className="p-4 text-gray-700">{account.name}</td>
              <td className="p-4 text-gray-700">{account.type}</td>
              <td className="p-4 text-gray-700">{account.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Accounts;
