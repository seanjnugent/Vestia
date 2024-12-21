import React from 'react';
import { useParams } from 'react-router-dom';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Sparkles, TrendingUp, History, Wallet, PiggyBank, ArrowUpRight, BadgeDollarSign, PlusCircle } from 'lucide-react';

const Account = () => {
  const { id } = useParams();
  const accountDetails = {
    id,
    name: '✨ Retirement Dreams ISA ✨',
    type: 'Stocks & Shares ISA',
    managed_portfolio_id: 'AGG-001', // Remove this line for self-directed accounts
    managed_portfolio_name: 'Aggressive Growth Portfolio',
    value: '£45,340',
    yearChange: '+£3,240',
    yearPercentage: '+7.2%',
    availableToInvest: '£4,660',
    isaTaxYear: '2024/25',
    yearlyAllowance: '£20,000',
    riskProfile: 'Balanced Growth',
    lastUpdated: 'Today at 16:20',
    performanceData: [
      { month: 'Jan', value: 42100 },
      { month: 'Feb', value: 42800 },
      { month: 'Mar', value: 43500 },
      { month: 'Apr', value: 43200 },
      { month: 'May', value: 44100 },
      { month: 'Jun', value: 45340 }
    ],
    holdings: [
      { name: 'Vanguard FTSE All-World', value: 15200, allocation: 33.5, targetAllocation: 35, change: '+2.3%' },
      { name: 'iShares Global Clean Energy', value: 8400, allocation: 18.5, targetAllocation: 20, change: '+1.8%' },
      { name: 'Scottish Mortgage IT', value: 7300, allocation: 16.1, targetAllocation: 15, change: '-0.5%' },
      { name: 'Fundsmith Equity', value: 6900, allocation: 15.2, targetAllocation: 15, change: '+1.2%' },
      { name: 'Cash', value: 7540, allocation: 16.7, targetAllocation: 15, change: '+0.1%' }
    ],
    recentActivity: [
      { date: '2024-03-15', type: 'Dividend', description: 'FTSE All-World Dividend', value: '+£123.45' },
      { date: '2024-03-10', type: 'Buy', description: 'Bought Fundsmith Equity', value: '-£500.00' },
      { date: '2024-03-01', type: 'Deposit', description: 'Monthly Investment', value: '+£500.00' },
    ]
  };

  const isManaged = !!accountDetails.managed_portfolio_id;
  const COLORS = ['#ec4899', '#8b5cf6', '#3b82f6', '#06b6d4', '#10b981'];

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50">
      {/* Header */}
      <div className={`bg-white rounded-xl shadow-lg p-6 mb-6 border border-pink-100 ${isManaged ? 'bg-gradient-to-r from-pink-50/50 to-violet-50/50' : ''}`}>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-violet-500 text-transparent bg-clip-text flex items-center gap-2">
              {accountDetails.name}
              <Sparkles className="w-6 h-6 text-pink-500" />
            </h1>
            {isManaged && (
              <div className="mt-2">
                <span className="px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-sm">
                  {accountDetails.managed_portfolio_name}
                </span>
                <p className="text-gray-600 mt-2">Your investment allocations are managed by Vestia</p>
              </div>
            )}
            <p className="text-gray-600 mt-2">Last updated: {accountDetails.lastUpdated}</p>
          </div>
          <div className="text-right space-y-2">
            <div>
              <p className="text-xl font-semibold text-gray-800">{accountDetails.value}</p>
              <p className="text-green-500 font-medium">{accountDetails.yearChange} ({accountDetails.yearPercentage})</p>
            </div>
            <div className="flex gap-2 justify-end">
              <button className="px-3 py-1.5 text-sm rounded-lg bg-gradient-to-r from-pink-100 to-violet-100 hover:from-pink-200 hover:to-violet-200 text-gray-700 transition-all flex items-center gap-1">
                <PlusCircle className="w-4 h-4" />
                New Trade
              </button>
              <button className="px-3 py-1.5 text-sm rounded-lg bg-gradient-to-r from-pink-100 to-violet-100 hover:from-pink-200 hover:to-violet-200 text-gray-700 transition-all flex items-center gap-1">
                <PlusCircle className="w-4 h-4" />
                New Payment
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* ISA Allowance Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-pink-100">
          <div className="flex items-center gap-2 mb-4">
            <PiggyBank className="w-5 h-5 text-pink-500" />
            <h2 className="text-xl font-semibold">ISA Allowance {accountDetails.isaTaxYear}</h2>
          </div>
          <div className="space-y-2">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-gradient-to-r from-pink-500 to-violet-500 h-2.5 rounded-full" 
                   style={{ width: '76.7%' }}></div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Available: {accountDetails.availableToInvest}</span>
              <span className="text-gray-600">Allowance: {accountDetails.yearlyAllowance}</span>
            </div>
          </div>
        </div>

        {/* Risk Profile Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-pink-100">
          <div className="flex items-center gap-2 mb-4">
            <BadgeDollarSign className="w-5 h-5 text-pink-500" />
            <h2 className="text-xl font-semibold">Account Details</h2>
          </div>
          <div className="space-y-2">
            <p className="text-gray-600">Type: {accountDetails.type}</p>
            <p className="text-gray-600">Risk Profile: {accountDetails.riskProfile}</p>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Performance Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-pink-100">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-pink-500" />
            <h2 className="text-xl font-semibold">Performance</h2>
          </div>
          <LineChart width={400} height={250} data={accountDetails.performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip />
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

        {/* Holdings Pie Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-pink-100">
          <div className="flex items-center gap-2 mb-4">
            <Wallet className="w-5 h-5 text-pink-500" />
            <h2 className="text-xl font-semibold">Asset Allocation</h2>
          </div>
          <div className="flex flex-col items-center">
            <PieChart width={400} height={300}>
              <Pie
                data={accountDetails.holdings}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {accountDetails.holdings.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ paddingTop: '10px' }}
              />
            </PieChart>
          </div>
        </div>


      <div className={`bg-white rounded-xl shadow-lg p-6 mb-6 border border-pink-100 ${isManaged ? 'bg-gradient-to-r from-pink-50/50 to-violet-50/50' : ''}`}>
        <div className="flex items-center gap-2 mb-4">
          <Wallet className="w-5 h-5 text-pink-500" />
          <h2 className="text-xl font-semibold">Holdings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-pink-50 to-violet-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Holding</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Value</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Current %</th>
                {isManaged && (
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Target %</th>
                )}
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Change</th>
              </tr>
            </thead>
            <tbody>
              {accountDetails.holdings.map((holding, index) => (
                <tr key={holding.name} className="group hover:bg-gradient-to-r hover:from-pink-50 hover:to-violet-50 transition-colors">
                  <td className="px-4 py-3 border-t border-pink-100">{holding.name}</td>
                  <td className="px-4 py-3 border-t border-pink-100 text-right">£{holding.value.toLocaleString()}</td>
                  <td className="px-4 py-3 border-t border-pink-100 text-right">
                    {holding.allocation}%
                    {isManaged && Math.abs(holding.allocation - holding.targetAllocation) > 1 && (
                      <span className={holding.allocation > holding.targetAllocation ? 'text-red-500 ml-1' : 'text-green-500 ml-1'}>
                        {holding.allocation > holding.targetAllocation ? '↑' : '↓'}
                      </span>
                    )}
                  </td>
                  {isManaged && (
                    <td className="px-4 py-3 border-t border-pink-100 text-right text-gray-500">
                      {holding.targetAllocation}%
                    </td>
                  )}
                  <td className={`px-4 py-3 border-t border-pink-100 text-right ${holding.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                    {holding.change}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-pink-100">
        <div className="flex items-center gap-2 mb-4">
          <History className="w-5 h-5 text-pink-500" />
          <h2 className="text-xl font-semibold">Recent Activity</h2>
        </div>
        <div className="space-y-3">
          {accountDetails.recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gradient-to-r hover:from-pink-50 hover:to-violet-50 transition-colors">
              <div>
                <p className="font-medium">{activity.description}</p>
                <p className="text-sm text-gray-600">{activity.date}</p>
              </div>
              <p className={`font-medium ${activity.value.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                {activity.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>

  );
};

export default Account;