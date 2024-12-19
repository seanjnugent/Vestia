import React from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useNavigate } from "react-router-dom";
import { 
  PlusCircle, 
  CreditCard, 
  TrendingUp, 
  ArrowUpRight 
} from 'lucide-react';
import { motion } from 'framer-motion';

// Register Chart.js components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend
);

const Home = () => {
  const navigate = useNavigate();

  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Portfolio Value (£)',
        data: [2000, 2200, 2300, 2400, 2450, 2500, 2540],
        borderColor: '#3b82f6',
        backgroundColor: 'linear-gradient(to right, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0))',
        tension: 0.4, // Smooth curve
        fill: 'start'
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          borderDash: [5, 5],
          color: 'rgba(0,0,0,0.05)',
        },
      },
    },
  };

  const ActionButton = ({ icon: Icon, title, description, onClick }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex items-center p-5 rounded-2xl bg-white shadow-md hover:shadow-lg transition-all duration-300 group border border-gray-100 w-full max-w-full" // Make buttons full width with max-width
    >
      <Icon className="text-blue-500 w-7 h-7 mr-4 group-hover:rotate-12 transition-transform" /> {/* Larger icon and margin */}
      <div className="flex-grow text-left"> {/* Added text-left */}
        <h3 className="text-lg font-medium text-gray-900">{title}</h3> {/* Changed font-semibold to font-medium */}
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
      <ArrowUpRight className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5" /> {/* Gray arrow and smaller size */}
    </motion.button>
  );
  
  return (
    <div className="min-h-screen bg-gray-50 font-system"> {/* Changed background */}
      <div className="max-w-7xl mx-auto py-12 px-6 lg:px-8 space-y-12"> {/* Added py and increased max-w */}
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between"> {/* Added flex for responsiveness */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1> {/* Added tracking-tight */}
            <p className="mt-1 text-base text-gray-500">Your investment overview</p>
          </div>
          {/* Removed the extra div here */}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8"> {/* Increased gap */}
          {/* Portfolio Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-white rounded-2xl shadow-md p-8 border border-gray-100" // Updated styling
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2"> {/* Changed text color */}
                  <TrendingUp className="text-blue-500 w-6 h-6" />
                  Portfolio Performance
                </h2>
                <p className="text-4xl font-bold text-gray-900 mt-2 tracking-tight">{/* Changed text color and font weight */}£2,540</p>
              </div>
              <div className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full font-medium"> {/* Added font-medium */}
                +12.5% this month
              </div>
            </div>
            <div className="h-72 relative"> {/* Increased height and added relative positioning */}
              <Line data={data} options={options} />
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6" // Used space-y instead of flex for better spacing
          >
            <ActionButton
              icon={PlusCircle}
              title="New Trade"
              description="Buy or sell assets"
              onClick={() => navigate("/new-trade")}
            />
            <ActionButton
              icon={CreditCard}
              title="Manage Cash"
              description="Deposit or withdraw funds"
              onClick={() => navigate("/new-payment")}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;