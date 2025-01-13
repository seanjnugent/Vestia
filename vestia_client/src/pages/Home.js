// Home.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, CreditCard, TrendingUp, ArrowUpRight, Coins, PiggyBank } from 'lucide-react';
import { motion } from 'framer-motion';
import { BeatLoader } from 'react-spinners';
import PerformanceGraph from '../components/PerformanceGraph';

const Home = () => {
  const navigate = useNavigate();
  const [clientData, setClientData] = useState(null);
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          throw new Error('No user ID found');
        }

        const response = await fetch(`http://localhost:5000/api/clients/getClientSummary/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch client data');
        }

        const data = await response.json();
        setClientData(data[0]);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching client data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, []);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          throw new Error('No user ID found');
        }

        const today = new Date();
        const ninetyDaysAgo = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
        const endDate = today.toISOString().split('T')[0];
        const startDate = ninetyDaysAgo.toISOString().split('T')[0];

        const response = await fetch(`http://localhost:5000/api/clients/getClientPerformance/${userId}?start_date=${startDate}&end_date=${endDate}`);
        if (!response.ok) {
          throw new Error('Failed to fetch performance data');
        }

        const data = await response.json();
        setPerformanceData(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching performance data:', err);
      }
    };

    fetchPerformanceData();
  }, []);

  const ActionButton = ({ icon: Icon, title, description, onClick }) => (
    <motion.button
      whileHover={{ scale: 1.05, backgroundColor: '#c2f2ea' }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex items-center p-5 rounded-2xl bg-white shadow-md transition-all duration-300 group border border-gray-100 w-full max-w-full"
      style={{ border: '1px solid #38d6b7' }}
    >
      <Icon className="text-[#38d6b7] w-7 h-7 mr-4 group-hover:rotate-12 transition-transform" />
      <div className="flex-grow text-left">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
      <ArrowUpRight className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5" />
    </motion.button>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-teal-50 to-white">
        <BeatLoader color="#38d6b7" size={15} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-red-500 text-xl">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="max-w-7xl mx-auto py-12 px-6 lg:px-8 space-y-12">
        <div className="md:flex md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold" style={{ color: '#00836f' }}>
              Welcome, {clientData?.first_name || 'User'}
            </h1>
            <p className="mt-1 text-xl text-gray-600">Your investment overview</p>
          </div>
        </div>
        <div className="flex gap-8">
          <div className="flex-1">
            <PerformanceGraph portfolioHistory={performanceData} title="Portfolio Performance" />
          </div>
          <div className="w-1/5 space-y-6">
            <ActionButton
              icon={Coins}
              title="New Trade"
              description="Buy or sell an asset"
              onClick={() => navigate('/new-trade')}
            />
            <ActionButton
              icon={PiggyBank}
              title="Deposit Funds"
              description="Add funds to your portfolio"
              onClick={() => navigate('/deposit')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;