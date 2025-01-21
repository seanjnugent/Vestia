import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Minus, TrendingUp, ArrowUpRight, Coins, PiggyBank } from 'lucide-react';
import { motion } from 'framer-motion';
import { BeatLoader } from 'react-spinners';
import PerformanceGraph from '../components/PerformanceGraph';

const Home = () => {
  const navigate = useNavigate();
  const [clientData, setClientData] = useState(null);
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasFetched, setHasFetched] = useState(false); // Prevent duplicate calls

  useEffect(() => {
    if (hasFetched) return; // Exit early if data has already been fetched

    const fetchData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          throw new Error('No user ID found');
        }

        const today = new Date();
        const ninetyDaysAgo = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
        const endDate = today.toISOString().split('T')[0];
        const startDate = ninetyDaysAgo.toISOString().split('T')[0];

        const [clientResponse, performanceResponse] = await Promise.all([
          fetch(`http://localhost:5000/api/clients/getClientSummary/${userId}`),
          fetch(`http://localhost:5000/api/clients/getClientPerformance/${userId}?start_date=${startDate}&end_date=${endDate}`)
        ]);

        if (!clientResponse.ok) {
          throw new Error('Failed to fetch client data');
        }
        if (!performanceResponse.ok) {
          const errorData = await performanceResponse.json();
          if (errorData.message === 'No client performance data found') {
            setPerformanceData([]);
            setError(null);
          } else {
            throw new Error('Failed to fetch performance data');
          }
        } else {
          const clientData = await clientResponse.json();
          const performanceData = await performanceResponse.json();
          setClientData(clientData[0]);
          setPerformanceData(performanceData);
        }
        setHasFetched(true); // Prevent future calls
      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hasFetched]); // Dependency array includes hasFetched

  const ActionButton = ({ icon: Icon, title, description, onClick, isClickable = true, additionalText }) => (
    <motion.button
      whileHover={isClickable ? { scale: 1.05, backgroundColor: '#c2f2ea' } : {}}
      whileTap={isClickable ? { scale: 0.95 } : {}}
      onClick={isClickable ? onClick : null}
      className={`flex items-center p-5 rounded-2xl bg-white shadow-md transition-all duration-300 group border border-gray-100 w-full max-w-full h-full ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
      style={{ border: '1px solid #38d6b7' }}
    >
      <Icon className="text-[#38d6b7] w-7 h-7 mr-4 group-hover:rotate-12 transition-transform" />
      <div className="flex-grow text-left">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
        {additionalText && <p className="text-xs text-gray-400 mt-1">{additionalText}</p>}
      </div>
      {isClickable && <ArrowUpRight className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5" />}
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
            <h1 className="text-4xl font-bold" style={{ color: '#1e90a7' }}>
              Welcome, {clientData?.first_name || 'User'}
            </h1>
            <p className="mt-1 text-xl text-gray-600">Your investment overview</p>
          </div>
        </div>
        <div className="flex gap-8">
          <div className="flex-1">
            <PerformanceGraph
              portfolioHistory={performanceData}
              title="Portfolio Performance"
              liveData={clientData}
            />
          </div>
          <div className="w-1/5 space-y-6 flex flex-col">
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
              onClick={() => navigate('/new-deposit')}
            />
            <ActionButton
              icon={Minus}
              title="Withdraw Funds"
              description="Withdraw funds to your bank account"
              onClick={() => navigate('/withdraw')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
