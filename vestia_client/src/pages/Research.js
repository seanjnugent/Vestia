import React, { useState } from 'react';
import { Search, TrendingUp, Star, Globe, Clock, PieChart, BarChart2, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const Research = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const researchCategories = [
    {
      title: 'Stocks',
      icon: <TrendingUp className="w-12 h-12 text-[#00836f]" />,
      description: 'Explore and analyze top-performing companies',
      link: '/research/stocks'
    },
    {
      title: 'ETFs & Funds',
      icon: <PieChart className="w-12 h-12 text-[#00836f]" />,
      description: 'Discover a selection of diversified investment options',
      link: '/research/funds'
    },
    {
      title: 'Crypto',
      icon: <Globe className="w-12 h-12 text-[#00836f]" />,
      description: 'Gain insights into the growing digital asset market',
      link: '/research/crypto'
    }
  ];

  const topNews = [
    {
      title: 'AI Stocks Surge on Breakthrough Innovations',
      source: 'TechFinance',
      time: '10m ago',
      sentiment: 'positive'
    },
    {
      title: 'Federal Reserve Signals Potential Rate Cuts',
      source: 'MarketInsider',
      time: '1h ago',
      sentiment: 'neutral'
    },
    {
      title: 'Emerging Markets Show Strong Growth Potential',
      source: 'GlobalInvestor',
      time: '3h ago',
      sentiment: 'positive'
    }
  ];

  const performanceWidgets = [
    {
      title: 'Market Movers',
      icon: <Award className="w-6 h-6 text-[#00836f]" />,
      data: [
        { name: 'Apple', symbol: 'AAPL', change: '+2.5%', price: '$180.50' },
        { name: 'Microsoft', symbol: 'MSFT', change: '+3.0%', price: '$315.40' }
      ]
    },
    {
      title: 'Watchlist Performance',
      icon: <Star className="w-6 h-6 text-[#00836f]" />,
      data: [
        { name: 'Tesla', symbol: 'TSLA', change: '+1.8%', price: '$240.20' },
        { name: 'NVIDIA', symbol: 'NVDA', change: '+4.2%', price: '$450.75' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-[#00836f]">
          Research Dashboard
        </h1>
        <div className="relative w-96">
          <input
            type="text"
            placeholder="Search stocks, ETFs, news..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-10 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00836f] transition-all"
          />
          <Search className="absolute left-3 top-3.5 text-gray-400" />
        </div>
      </div>

      {/* Research Categories */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {researchCategories.map((category, index) => (
          <Link to={category.link} key={index} className="group">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer">
              <div className="flex items-center mb-4">
                {category.icon}
                <h2 className="ml-4 text-xl font-bold text-gray-800">{category.title}</h2>
              </div>
              <p className="text-gray-600">{category.description}</p>
              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[#00836f] font-semibold">Explore →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-3 gap-6">
        {/* Performance Widgets */}
        <div className="col-span-2 space-y-6">
          {performanceWidgets.map((widget, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md"
            >
              <div className="flex items-center mb-4">
                {widget.icon}
                <h3 className="ml-2 text-lg font-bold text-gray-800">{widget.title}</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {widget.data.map((stock, stockIndex) => (
                  <div
                    key={stockIndex}
                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-bold text-gray-800">{stock.name}</h4>
                        <p className="text-gray-500 text-sm">{stock.symbol}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${stock.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                          {stock.change}
                        </p>
                        <p className="text-gray-800">{stock.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* News Feed */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center mb-4">
            <Clock className="w-6 h-6 text-gray-500 mr-2" />
            <h2 className="text-lg font-bold text-gray-800">Latest News</h2>
          </div>
          <div className="space-y-4">
            {topNews.map((news, index) => (
              <div
                key={index}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <h3 className="font-semibold text-gray-800 mb-1">{news.title}</h3>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{news.source}</span>
                  <span
                    className={`
                      ${news.sentiment === 'positive' ? 'text-green-500' :
                        news.sentiment === 'negative' ? 'text-red-500' : 'text-gray-500'}
                    `}
                  >
                    {news.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Research;
