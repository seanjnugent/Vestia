import React, { useMemo, useState } from 'react';
import { 
  ArrowUp, 
  ArrowDown, 
  PlusCircle, 
  RefreshCw, 
  Filter, 
  ChevronDown 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Enhanced mock trade data with more dynamic information
const trades = [
  {
    id: 1,
    date: '2024-12-12',
    type: 'Buy',
    account: 'Investment Account',
    status: 'Completed',
    instrumentCode: 'GOOGL',
    units: 10,
    sum: '£1,500',
    color: 'bg-green-100',
    icon: '📈'
  },
  {
    id: 2,
    date: '2024-12-11',
    type: 'Sell',
    account: 'Savings Account',
    status: 'Pending',
    instrumentCode: 'BABA',
    units: 5,
    sum: '£800',
    color: 'bg-yellow-100',
    icon: '⏳'
  },
  {
    id: 3,
    date: '2024-12-10',
    type: 'Buy',
    account: 'Investment Account',
    status: 'Completed',
    instrumentCode: 'AAPL',
    units: 15,
    sum: '£2,200',
    color: 'bg-blue-100',
    icon: '📊'
  },
];

const StatusBadge = ({ status }) => {
  const statusStyles = {
    'Completed': 'bg-green-100 text-green-800',
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Cancelled': 'bg-red-100 text-red-800'
  };

  return (
    <span className={`
      px-2 py-1 rounded-full text-xs font-medium 
      ${statusStyles[status] || 'bg-gray-100 text-gray-800'}
    `}>
      {status}
    </span>
  );
};

const TradesTable = () => {
  const [sortConfig, setSortConfig] = useState({ 
    key: 'date', 
    direction: 'desc' 
  });
  const [filter, setFilter] = useState('');
  const navigate = useNavigate();

  const sortedAndFilteredTrades = useMemo(() => {
    let result = [...trades];

    // Filter
    if (filter) {
      result = result.filter(trade => 
        Object.values(trade).some(value => 
          value.toString().toLowerCase().includes(filter.toLowerCase())
        )
      );
    }

    // Sort
    return result.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [sortConfig, filter]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            Trade History
          </h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search trades..." 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="
                  pl-10 pr-4 py-2 rounded-xl border 
                  focus:ring-2 focus:ring-indigo-300 
                  transition-all duration-300
                "
              />
              <Filter className="absolute left-3 top-3 text-gray-400" />
            </div>
            <button
              onClick={() => navigate("/new-trade")}
              className="
                flex items-center gap-2 px-4 py-2 
                bg-gradient-to-r from-indigo-600 to-purple-600 
                text-white rounded-xl shadow-lg 
                hover:scale-105 transition-all duration-300
              "
            >
              <PlusCircle size={18} /> New Trade
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                {[
                  'Date', 'Type', 'Account', 'Status', 
                  'Instrument Code', 'Units', 'Sum'
                ].map((header) => (
                  <th 
                    key={header}
                    onClick={() => handleSort(header.toLowerCase().replace(/\s/g, ''))}
                    className="
                      px-6 py-4 text-left text-xs font-medium 
                      text-gray-600 uppercase tracking-wider
                      cursor-pointer hover:bg-gray-200
                      transition-all duration-300
                    "
                  >
                    <div className="flex items-center gap-2">
                      {header}
                      {sortConfig.key === header.toLowerCase().replace(/\s/g, '') && (
                        sortConfig.direction === 'asc' 
                          ? <ArrowUp size={16} /> 
                          : <ArrowDown size={16} />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedAndFilteredTrades.map((trade) => (
                <tr 
                  key={trade.id} 
                  className="
                    hover:bg-indigo-50 transition-all 
                    duration-300 border-b last:border-b-0
                  "
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="mr-3">{trade.icon}</span>
                      {trade.date}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`
                      px-3 py-1 rounded-full text-xs font-medium
                      ${trade.type === 'Buy' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'}
                    `}>
                      {trade.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">{trade.account}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={trade.status} />
                  </td>
                  <td className="px-6 py-4">{trade.instrumentCode}</td>
                  <td className="px-6 py-4">{trade.units}</td>
                  <td className="px-6 py-4 font-semibold">{trade.sum}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {sortedAndFilteredTrades.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No trades found 🕹️
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-gray-500 flex justify-center items-center gap-2">
          <RefreshCw size={16} className="animate-spin" />
          Last updated: Just now
        </div>
      </div>
    </div>
  );
};

export default TradesTable;