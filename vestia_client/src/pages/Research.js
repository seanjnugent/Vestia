import React, { useState, useEffect } from 'react';
import {
  Search,
  TrendingUp,
  HandCoins,
  Bitcoin,
  PieChart,
  Award,
  BarChart2,
  Star,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Research = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [topNews, setTopNews] = useState([]);
  const [marketMovers, setMarketMovers] = useState({
    gainers: [],
    losers: []
  });

  useEffect(() => {
    // Fetch top news articles
    fetch('https://newsapi.org/v2/top-headlines?category=business&language=en&pageSize=4&apiKey=2366b732db774672899eed3318502ef9')
      .then(response => response.json())
      .then(data => setTopNews(data.articles.slice(0, 4))); // Ensure only 4 articles are set
  
    // Fetch top gainers
    fetch('https://financialmodelingprep.com/api/v3/stock_market/gainers?exchange=NASDAQ&limit=5&apikey=NvRZ295N76rIqpVYZqrnWlntXYN65s8d')
      .then(response => response.json())
      .then(data => setMarketMovers(prev => ({ ...prev, gainers: data.slice(0, 5) }))); // Ensure only 5 gainers are set
  
    // Fetch top losers
    fetch('https://financialmodelingprep.com/api/v3/stock_market/losers?exchange=NASDAQ&limit=5&apikey=NvRZ295N76rIqpVYZqrnWlntXYN65s8d')
      .then(response => response.json())
      .then(data => setMarketMovers(prev => ({ ...prev, losers: data.slice(0, 5) }))); // Ensure only 5 losers are set
  
  }, []);
  const researchCategories = [
    {
      title: 'Stocks',
      icon: <TrendingUp className="w-12 h-12 text-[#00836f]" />,
      description: 'Explore and analyze top-performing companies',
      link: '/research/stocks'
    },
    {
      title: 'ETFs & Funds',
      icon: <HandCoins className="w-12 h-12 text-[#00836f]" />,
      description: 'Discover a selection of diversified investment options',
      link: '/research/funds'
    },
    {
      title: 'Crypto',
      icon: <Bitcoin className="w-12 h-12 text-[#00836f]" />,
      description: 'Gain insights into the growing digital asset market',
      link: '/research/crypto'
    },
    {
      title: 'Managed Portfolios',
      icon: <PieChart className="w-12 h-12 text-[#00836f]" />,
      description: 'Explore collections of investments tailored to your goals',
      link: '/research/managed-portfolios'
    }
  ];

  const performanceWidgets = [
    {
      title: 'Market Gainers',
      icon: <Award className="w-6 h-6 text-[#00836f]" />,
      data: marketMovers.gainers.map(gainer => ({
        name: gainer.name,
        symbol: gainer.symbol,
        change: `${(gainer.changesPercentage).toFixed(2)}%`,
        price: `$${gainer.price.toFixed(2)}`
      }))
    },
    {
      title: 'Market Losers',
      icon: <BarChart2 className="w-6 h-6 text-[#00836f]" />,
      data: marketMovers.losers.map(loser => ({
        name: loser.name,
        symbol: loser.symbol,
        change: `${(loser.changesPercentage).toFixed(2)}%`,
        price: `$${loser.price.toFixed(2)}`
      }))
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
    <div className="min-h-screen bg-gradient-to-br from-[#F9F9FB] to-[#EAEFF1] p-6 space-y-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#F0F8FF] via-[#F0F8FF] to-[#E0E7FF] animate-pulse opacity-20" />

      <div className="backdrop-blur-lg bg-white/30 rounded-3xl shadow-xl p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-[#00836f]">Research Dashboard</h1>
          <div className="relative w-96">
            <input
              type="text"
              placeholder="Search stocks, ETFs, news..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-10 border-2 border-gray-200 rounded-xl bg-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#00836f] transition-all"
            />
            <Search className="absolute left-3 top-3.5 text-gray-400" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {researchCategories.map((category, index) => (
            <Link to={category.link} key={index} className="group">
              <div className="backdrop-blur-sm bg-white/50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            {performanceWidgets.map((widget, index) => (
              <div key={index} className="backdrop-blur-md bg-white/50 p-6 rounded-2xl shadow-md">
                <div className="flex items-center mb-4">
                  {widget.icon}
                  <h3 className="ml-2 text-lg font-bold text-gray-800">{widget.title}</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {widget.data.map((stock, stockIndex) => (
                    <div key={stockIndex} className="p-4 bg-white/40 rounded-lg hover:bg-white/60 transition-colors">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-bold text-gray-800">{stock.name}</h4>
                          <p className="text-gray-500 text-sm">{stock.symbol}</p>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${stock.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{stock.change}</p>
                          <p className="text-gray-800">{stock.price}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="backdrop-blur-md bg-white/50 p-6 rounded-2xl shadow-md">
            <div className="flex items-center mb-4">
              <Clock className="w-6 h-6 text-gray-500 mr-2" />
              <h2 className="text-lg font-bold text-gray-800">Latest News</h2>
            </div>
            <div className="space-y-4">
              {topNews.map((news, index) => (
                <div key={index} className="p-4 bg-white/30 rounded-lg hover:bg-white/50 transition-colors">
                  <h3 className="font-semibold text-gray-800 mb-1">{news.title}</h3>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{news.source.name}</span>
                    <span>{new Date(news.publishedAt).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Research;
