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
  ArrowUpRight, 
  Users, 
  DollarSign, 
  FileText 
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

  const ActionButton = ({ 
    icon: Icon, 
    title, 
    description, 
    onClick, 
    className 
  }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        flex items-center p-4 rounded-xl 
        bg-white border border-blue-100 
        shadow-lg hover:shadow-xl 
        transition-all duration-300 
        group 
        ${className}
      `}
    >
      <div className="flex-grow">
        <div className="flex items-center gap-3">
          <Icon className="text-blue-500 w-6 h-6 group-hover:rotate-12 transition-transform" />
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
        <p className="text-sm text-gray-500 text-left mt-1">{description}</p>
      </div>
      <ArrowUpRight className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.button>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Portfolio Overview */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-blue-50"
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <TrendingUp className="text-blue-500" />
                  Portfolio Performance
                </h2>
                <p className="text-4xl font-semibold text-blue-600 mt-2">£2,540</p>
              </div>
              <div className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                +12.5% this month
              </div>
            </div>
            <div className="h-64">
              <Line data={data} options={options} />
            </div>
          </motion.div>

          {/* Recent Activity Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-blue-50"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <DollarSign className="text-green-500 w-6 h-6" />
                <span className="text-sm text-gray-600">Deposited £500</span>
              </div>
              <div className="flex items-center gap-3">
                <TrendingUp className="text-blue-500 w-6 h-6" />
                <span className="text-sm text-gray-600">Portfolio value increased by 12.5%</span>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col gap-6"
          >
            <ActionButton 
              icon={PlusCircle}
              title="Create New Fund"
              description="Start a new fund for clients to invest in"
              onClick={() => navigate("/new-fund")}
            />
            <ActionButton 
              icon={CreditCard}
              title="Manage Cash"
              description="Deposit or withdraw funds"
              onClick={() => navigate("/manage-cash")}
            />
            <ActionButton 
              icon={Users}
              title="View Clients"
              description="View and manage your clients"
              onClick={() => navigate("/clients")}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;
