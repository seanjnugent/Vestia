
// Research.jsx
import React, { useState, useEffect } from 'react';
import { Award, BarChart2, Clock, ChevronRight
} from 'lucide-react';
import HeroSection from '../components/HeroSection'
import CategoryCard from '../components/CategoryCard'
import NewsCard from '../components/NewsCard'
import MarketMoverCard from '../components/MarketMoverCard'
import RESEARCH_CATEGORIES from '../constants'

const Research = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [topNews, setTopNews] = useState([]);
  const [marketMovers, setMarketMovers] = useState({ gainers: [], losers: [] });
  const [hoveredCategory, setHoveredCategory] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newsResponse, gainersResponse, losersResponse] = await Promise.all([
          fetch('https://newsapi.org/v2/top-headlines?category=business&language=en&pageSize=4&apiKey=2366b732db774672899eed3318502ef9'),
          fetch('https://financialmodelingprep.com/api/v3/stock_market/gainers?exchange=NASDAQ&limit=5&apikey=NvRZ295N76rIqpVYZqrnWlntXYN65s8d'),
          fetch('https://financialmodelingprep.com/api/v3/stock_market/losers?exchange=NASDAQ&limit=5&apikey=NvRZ295N76rIqpVYZqrnWlntXYN65s8d')
        ]);

        const [newsData, gainersData, losersData] = await Promise.all([
          newsResponse.json(),
          gainersResponse.json(),
          losersResponse.json()
        ]);

        setTopNews(newsData.articles.slice(0, 4));
        setMarketMovers({
          gainers: gainersData.slice(0, 5),
          losers: losersData.slice(0, 5)
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const performanceWidgets = [
    {
      title: 'Trending Now',
      icon: <Award className="w-6 h-6 text-red-600" />,
      data: marketMovers.gainers.map(gainer => ({
        name: gainer.name,
        symbol: gainer.symbol,
        change: `${(gainer.changesPercentage).toFixed(2)}%`,
        price: `$${gainer.price.toFixed(2)}`
      }))
    },
    {
      title: 'Top Movers',
      icon: <BarChart2 className="w-6 h-6 text-red-600" />,
      data: marketMovers.losers.map(loser => ({
        name: loser.name,
        symbol: loser.symbol,
        change: `${(loser.changesPercentage).toFixed(2)}%`,
        price: `$${loser.price.toFixed(2)}`
      }))
    }
  ];

  return (
    <div className="min-h-screen bg-white p-6 space-y-8">
      <HeroSection searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* Categories Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
        <div className="grid grid-cols-4 gap-4">
          {RESEARCH_CATEGORIES.map((category, index) => (
            <CategoryCard
              key={index}
              category={category}
              isHovered={hoveredCategory === index}
              onHover={() => setHoveredCategory(index)}
              onLeave={() => setHoveredCategory(null)}
            />
          ))}
        </div>
      </div>

      {/* Market Movers Section */}
      {performanceWidgets.map((widget, index) => (
        <div key={index} className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              {widget.icon}
              {widget.title}
            </h2>
            <ChevronRight className="w-6 h-6 text-gray-400" />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {widget.data.map((stock, stockIndex) => (
              <MarketMoverCard key={stockIndex} stock={stock} />
            ))}
          </div>
        </div>
      ))}

      {/* News Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Clock className="w-6 h-6 text-red-600" />
          Latest News
        </h2>
        <div className="grid grid-cols-2 gap-6">
          {topNews.map((news, index) => (
            <NewsCard key={index} news={news} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Research;