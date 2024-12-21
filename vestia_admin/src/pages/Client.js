import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ArrowUpRight, Sparkles, CreditCard, TrendingUp, History, Edit2 } from 'lucide-react';

const sampleClientData = {
  name: 'John Doe',
  dob: '1985-03-15',
  contact: 'john.doe@email.com | +1 555-123-4567',
  address: '123 Main St, Anytown, CA 91234',
  totalValue: 125000,
  totalChange: 5000,
  accounts: [
    { name: 'Retirement Fund', value: 75000 },
    { name: 'Savings Account', value: 30000 },
    { name: 'Investment Portfolio', value: 20000 },
  ],
  performanceData: [
    { date: '2023-01', value: 100000 },
    { date: '2023-02', value: 102000 },
    { date: '2023-03', value: 105000 },
    { date: '2023-04', value: 110000 },
    { date: '2023-05', value: 115000 },
    { date: '2023-06', value: 120000 },
    { date: '2023-07', value: 125000 },
  ],
};

const Client = () => {
  const navigate = useNavigate();
  const [selectedAccount, setSelectedAccount] = useState(null);

  const handleAccountClick = (account) => {
    setSelectedAccount(account);
    navigate(`/account/${account.name}`, { state: { account } });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Client Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-pink-100">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-violet-500 text-transparent bg-clip-text flex items-center gap-2">
              {sampleClientData.name}
              <Sparkles className="w-6 h-6 text-pink-500" />
            </h1>
            <p className="text-gray-600 mt-2">{sampleClientData.contact}</p>
            <p className="text-gray-600">{sampleClientData.address}</p>
          </div>
          <button
            onClick={() => navigate('/editclient', { state: { sampleClientData } })}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-pink-100 to-violet-100 hover:from-pink-200 hover:to-violet-200 text-gray-700 transition-all"
          >
            <Edit2 className="w-4 h-4" />
            Edit Details
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Portfolio Value Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-pink-100">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-pink-500" />
            <h2 className="text-xl font-semibold">Total Portfolio Value</h2>
          </div>
          <p className="text-3xl font-bold text-gray-800">
            ${sampleClientData.totalValue.toLocaleString()}
          </p>
          <p className={`text-lg mt-2 ${sampleClientData.totalChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {sampleClientData.totalChange >= 0 ? '↗' : '↘'} ${Math.abs(sampleClientData.totalChange).toLocaleString()}
            <span className="text-sm text-gray-500 ml-2">This Month</span>
          </p>
        </div>

        {/* Accounts List Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-pink-100">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-pink-500" />
            <h2 className="text-xl font-semibold">Accounts</h2>
          </div>
          <div className="space-y-3">
            {sampleClientData.accounts.map((account) => (
              <div
                key={account.name}
                onClick={() => handleAccountClick(account)}
                className="flex items-center justify-between p-3 rounded-lg cursor-pointer group hover:bg-gradient-to-r hover:from-pink-50 hover:to-violet-50 transition-all"
              >
                <div>
                  <p className="font-medium">{account.name}</p>
                  <p className="text-gray-600">${account.value.toLocaleString()}</p>
                </div>
                <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity text-pink-500" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-pink-100">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-pink-500" />
          <h2 className="text-xl font-semibold">Portfolio Performance</h2>
        </div>
        <div className="w-full overflow-x-auto">
          <LineChart width={700} height={300} data={sampleClientData.performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="url(#colorGradient)" 
              strokeWidth={2}
              dot={{ fill: '#ec4899' }}
              activeDot={{ r: 8, fill: '#ec4899' }} 
            />
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </LineChart>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-pink-100">
        <div className="flex items-center gap-2 mb-4">
          <History className="w-5 h-5 text-pink-500" />
          <h2 className="text-xl font-semibold">Recent Activity</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
            New Payment: $1,000
          </span>
          <span className="px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-sm">
            Trade: AAPL - 10 Shares
          </span>
          <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
            Dividend Received: $50
          </span>
        </div>
      </div>
    </div>
  );
};

export default Client;