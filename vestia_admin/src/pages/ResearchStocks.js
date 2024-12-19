import React, { useState } from 'react';
import { 
  TrendingUp, 
  Star, 
  ArrowUp, 
  ArrowDown, 
  Filter, 
  BarChart2, 
  Info 
} from 'lucide-react';

const Stocks = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Enhanced stock data with more information
  const stockData = [
    { 
      name: "Apple", 
      symbol: "AAPL", 
      change: "+2.5%", 
      price: "$180.50",
      marketCap: "$2.8T",
      sector: "Technology",
      performance: 'positive',
      details: {
        peRatio: 28.5,
        dividend: "0.73%",
        volume: "35.2M"
      }
    },
    { 
      name: "Tesla", 
      symbol: "TSLA", 
      change: "+1.8%", 
      price: "$240.20",
      marketCap: "$750B",
      sector: "Automotive",
      performance: 'positive',
      details: {
        peRatio: 45.3,
        dividend: "N/A",
        volume: "22.1M"
      }
    },
    { 
      name: "Microsoft", 
      symbol: "MSFT", 
      change: "+3.0%", 
      price: "$315.40",
      marketCap: "$2.5T",
      sector: "Technology",
      performance: 'positive',
      details: {
        peRatio: 32.7,
        dividend: "0.89%",
        volume: "28.5M"
      }
    },
    { 
      name: "Nvidia", 
      symbol: "NVDA", 
      change: "+4.2%", 
      price: "$450.75",
      marketCap: "$1.2T",
      sector: "Technology",
      performance: 'positive',
      details: {
        peRatio: 55.2,
        dividend: "0.03%",
        volume: "40.3M"
      }
    }
  ];

  // Filter options
  const filterOptions = [
    { label: 'All Stocks', value: 'all' },
    { label: 'Technology', value: 'technology' },
    { label: 'Gainers', value: 'gainers' }
  ];

  // Filter stocks based on active filter
  const filteredStocks = stockData.filter(stock => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'technology') return stock.sector.toLowerCase() === 'technology';
    if (activeFilter === 'gainers') return parseFloat(stock.change) > 0;
    return true;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <TrendingUp className="w-10 h-10 text-blue-500" />
          <h1 className="text-4xl font-bold text-gray-900">Stock Market</h1>
        </div>
        
        {/* Filter Section */}
        <div className="flex items-center space-x-4">
          <Filter className="text-gray-500" />
          <div className="flex space-x-2 bg-white p-2 rounded-xl shadow-sm">
            {filterOptions.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-semibold transition-all
                  ${activeFilter === filter.value 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'}
                `}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stocks Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredStocks.map((stock, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-6 group cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">{stock.name}</h2>
                <p className="text-gray-500 text-sm">{stock.symbol}</p>
              </div>
              <Star className="text-gray-300 group-hover:text-blue-500 transition-colors" />
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <div>
                <p className="text-gray-600 text-xs">Price</p>
                <p className="font-bold text-gray-800">{stock.price}</p>
              </div>
              <div>
                <p className="text-gray-600 text-xs">Market Cap</p>
                <p className="font-bold text-gray-800">{stock.marketCap}</p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p 
                  className={`
                    font-semibold 
                    ${stock.change.startsWith('+') 
                      ? 'text-green-500' 
                      : 'text-red-500'}
                  `}
                >
                  {stock.change}
                </p>
                <p className="text-gray-500 text-xs">{stock.sector}</p>
              </div>
              {stock.change.startsWith('+') 
                ? <ArrowUp className="text-green-500" /> 
                : <ArrowDown className="text-red-500" />
              }
            </div>

            {/* Hover Details */}
            <div className="hidden group-hover:block mt-4 pt-4 border-t border-gray-100">
              <div className="grid grid-cols-3 text-center">
                <div>
                  <p className="text-xs text-gray-500">P/E Ratio</p>
                  <p className="font-semibold text-sm">{stock.details.peRatio}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Dividend</p>
                  <p className="font-semibold text-sm">{stock.details.dividend}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Volume</p>
                  <p className="font-semibold text-sm">{stock.details.volume}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stocks;