import {
   TrendingUp, HandCoins, Bitcoin, PieChart,
} from 'lucide-react';

const RESEARCH_CATEGORIES = [
  {
    title: 'Stocks',
    icon: <TrendingUp className="w-12 h-12" />,
    description: 'Explore and analyze top-performing companies',
    link: '/research/stocks',
    bgColor: 'from-purple-600 to-blue-500'
  },
  {
    title: 'ETFs & Funds',
    icon: <HandCoins className="w-12 h-12" />,
    description: 'Discover a selection of diversified investment options',
    link: '/research/funds',
    bgColor: 'from-red-600 to-pink-500'
  },
  {
    title: 'Crypto',
    icon: <Bitcoin className="w-12 h-12" />,
    description: 'Gain insights into the growing digital asset market',
    link: '/research/crypto',
    bgColor: 'from-green-600 to-teal-500'
  },
  {
    title: 'Managed Portfolios',
    icon: <PieChart className="w-12 h-12" />,
    description: 'Explore collections of investments tailored to your goals',
    link: '/research/managed-portfolios',
    bgColor: 'from-orange-600 to-yellow-500'
  }
];


  
export default RESEARCH_CATEGORIES