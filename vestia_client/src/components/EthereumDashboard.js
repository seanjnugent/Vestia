import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const EthereumDashboard = () => {
  const [currentPrice, setCurrentPrice] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [priceChange, setPriceChange] = useState({ value: 0, isPositive: true });

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/prices/getEthereumPrices/latest');
        const data = await response.json();
        
        if (data.price) {
          const price = parseFloat(data.price);
          setCurrentPrice(price);
          
          setPriceHistory(prev => {
            const newHistory = [...prev, {
              timestamp: new Date().toLocaleTimeString(),
              price: price
            }].slice(-20);
            
            if (newHistory.length > 1) {
              const change = price - newHistory[newHistory.length - 2].price;
              setPriceChange({
                value: Math.abs(change).toFixed(2),
                isPositive: change >= 0
              });
            }
            
            return newHistory;
          });
        }
      } catch (error) {
        console.error('Error fetching ETH price:', error);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">ETH/USD Live Price</h1>
          <p className="text-sm text-gray-500">Auto-updates every 5 seconds</p>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Current Price</span>
            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold text-gray-900">
                ${currentPrice?.toFixed(2) || '---'}
              </span>
              <span 
                className={`text-sm font-medium ${
                  priceChange.isPositive ? 'text-green-500' : 'text-red-500'
                }`}
              >
                ${priceChange.value} {priceChange.isPositive ? '↑' : '↓'}
              </span>
            </div>
          </div>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer>
            <LineChart data={priceHistory}>
              <XAxis 
                dataKey="timestamp"
                stroke="#6B7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6B7280"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '4px'
                }}
              />
              <Line 
                type="monotone"
                dataKey="price"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default EthereumDashboard;