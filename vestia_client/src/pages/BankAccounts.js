import React, { useState } from 'react';
import { Pencil, Trash2, Plus, CreditCard, Building2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const BankAccounts = () => {
  const [hoveredId, setHoveredId] = useState(null);

  const accounts = [
    { 
      id: 1, 
      country: 'UK', 
      type: 'Bank Account', 
      details: { sortCode: '12-34-56', accountNumber: '78901234' },
      gradient: 'from-purple-600 to-blue-500'
    },
    { 
      id: 2, 
      country: 'US', 
      type: 'Debit Card', 
      details: { cardNumber: '****1234', expiry: '12/25' },
      gradient: 'from-red-600 to-pink-500'
    },
  ];

  const getIcon = (type) => {
    return type === 'Bank Account' ? 
      <Building2 className="w-8 h-8" /> : 
      <CreditCard className="w-8 h-8" />;
  };

  const formatDetails = (account) => {
    if (account.type === 'Bank Account') {
      return {
        primary: account.details.sortCode,
        secondary: `Account: ${account.details.accountNumber}`
      };
    }
    return {
      primary: account.details.cardNumber,
      secondary: `Expires: ${account.details.expiry}`
    };
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 space-y-8">
      {/* Hero Section */}
      <div className="relative h-64 rounded-lg overflow-hidden mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
        <div className="relative z-20 h-full flex flex-col justify-center p-12">
          <h1 className="text-6xl font-bold mb-4">Your Payment Methods</h1>
          <p className="text-xl text-gray-300">Manage your linked accounts and cards</p>
        </div>
      </div>

      {/* Accounts Grid */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Linked Accounts</h2>
          <ChevronRight className="w-6 h-6 text-gray-400" />
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          {accounts.map(account => (
            <div
              key={account.id}
              className="relative rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-105"
              onMouseEnter={() => setHoveredId(account.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className={`relative h-48 bg-gradient-to-br ${account.gradient}`}>
                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      {getIcon(account.type)}
                      <h3 className="text-xl font-bold mt-2">{account.type}</h3>
                      <p className="text-sm text-gray-200">{account.country}</p>
                    </div>
                    
                    {/* Actions */}
                    <div className={`flex gap-2 transition-opacity duration-300 ${hoveredId === account.id ? 'opacity-100' : 'opacity-0'}`}>
                      <Link
                        to={`/edit-account/${account.id}`}
                        className="p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => console.log(`Delete account ${account.id}`)}
                        className="p-2 rounded-full bg-black/30 hover:bg-red-500/50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Account Details */}
                  <div className="mt-auto">
                    <p className="text-2xl font-mono font-bold">{formatDetails(account).primary}</p>
                    <p className="text-sm text-gray-200">{formatDetails(account).secondary}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Add New Account Card */}
          <Link
            to="/new-bank-account"
            className="relative h-48 rounded-lg border-2 border-dashed border-gray-700 hover:border-gray-500 transition-colors flex flex-col items-center justify-center gap-4 group"
          >
            <div className="w-12 h-12 rounded-full bg-gray-900 group-hover:bg-gray-800 transition-colors flex items-center justify-center">
              <Plus className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
            </div>
            <div className="text-center">
              <p className="font-bold text-gray-400 group-hover:text-white transition-colors">Add New Account</p>
              <p className="text-sm text-gray-500 group-hover:text-gray-400 transition-colors">Connect a bank account or card</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BankAccounts;