import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sparkles, PlusCircle, History, PiggyBank, Wallet, RefreshCw } from 'lucide-react';
import PerformanceGraph from '../components/PerformanceGraph';
import { BeatLoader } from 'react-spinners';
import PieChart from '../components/PieChart';
import HoldingsTable from '../components/HoldingsTable';

const Account = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [accountDetails, setAccountDetails] = useState(null);
  const [portfolioHistory, setPortfolioHistory] = useState([]);
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPaymentMenu, setShowPaymentMenu] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const today = new Date();
        const ninetyDaysAgo = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
        const endDate = today.toISOString().split('T')[0];
        const startDate = ninetyDaysAgo.toISOString().split('T')[0];

        const [accountResponse, historyResponse, holdingsResponse] = await Promise.all([
          fetch(`http://localhost:5000/api/accounts/getAccountSummary/${id}`),
          fetch(`http://localhost:5000/api/accounts/getAccountPerformance/${id}?start_date=${startDate}&end_date=${endDate}`),
          fetch(`http://localhost:5000/api/accounts/getAccountHoldings/${id}`),
        ]);

        if (!accountResponse.ok || !historyResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const [accountData, historyData] = await Promise.all([
          accountResponse.json(),
          historyResponse.json(),
        ]);

        let holdingsData = [];
        if (holdingsResponse.ok) {
          holdingsData = await holdingsResponse.json();
        } else if (holdingsResponse.status === 404) {
          console.warn(`No holdings found for account ID: ${id}`);
        } else {
          throw new Error('Failed to fetch holdings data');
        }

        if (Array.isArray(accountData) && accountData.length > 0) {
          setAccountDetails(accountData[0]);
        }

        setPortfolioHistory(Array.isArray(historyData) ? historyData : []);
        setHoldings(holdingsData);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#e6f0ee] to-white">
        <BeatLoader color="#38d6b7" size={15} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
        {error}
      </div>
    );
  }

  const isManaged = !!accountDetails?.managed_portfolio_name;
  const totalValue = Number(accountDetails?.total_asset_balance || 0) + Number(accountDetails?.cash_balance || 0);
  const isISA = accountDetails?.account_type === 'IndividualSavingsAccount';
  const allowanceLimit = 20000; // ISA allowance limit
  const progress = Math.min((totalValue / allowanceLimit) * 100, 100).toFixed(2);

  const formatAccountType = (type) => {
    if (!type) return 'Unknown Account Type';
    return type
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
      .trim();
  };

  const pieData = {
    labels: [...holdings.map((holding) => holding.asset_code), "Cash"],
    datasets: [
      {
        label: 'Holdings',
        data: [
          ...holdings.map((holding) => holding.asset_value),
          Number(accountDetails?.cash_balance || 0),
        ],
        backgroundColor: ['#38d6b7', '#339e8f', '#008080', '#99d4cf', '#cceef0', '#FFD700'], // Add a unique color for Cash
      },
    ],
  };
  
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex justify-between items-start">
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                {accountDetails?.account_name}
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                {formatAccountType(accountDetails?.account_type)}
              </p>
            </div>

            {isISA && (
              <div className="mt-4">
                <h2 className="text-sm text-gray-500 mb-2">ISA Allowance Used</h2>
                <div className="w-full h-4 bg-gray-200 rounded-lg relative">
                  <div
                    className="absolute top-0 left-0 h-4 bg-gradient-to-r from-[#38d6b7] to-[#2bb29b] rounded-lg"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  £{totalValue.toLocaleString()} of £{allowanceLimit.toLocaleString()} used ({progress}%)
                </p>
              </div>
            )}

            {isManaged && (
              <div className="mt-2">
                <span className="px-3 py-1 rounded-full bg-[#e6f0ee] text-[#38d6b7] text-sm">
                  {accountDetails?.managed_portfolio_name}
                </span>
                <p className="text-gray-600 mt-2">Managed by Vestia</p>
              </div>
            )}
          </div>

          <div className="text-right space-y-2">
            <p className="text-2xl font-semibold">
              £{totalValue.toLocaleString()}
            </p>
            <p className="text-gray-600 font-medium">
              Cash Available: £{Number(accountDetails?.cash_balance || 0).toLocaleString()}
            </p>
            <div className="flex gap-2 mt-4 justify-end relative">
              <button
                onClick={() => navigate('/new-trade')}
                className="flex items-center gap-1 px-4 py-2 bg-[#38d6b7] text-white rounded-md hover:bg-[#2bb29b] transition-all duration-300 shadow-md hover:shadow-lg text-sm"
              >
                <RefreshCw size={14} />
                <span>New Trade</span>
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowPaymentMenu(!showPaymentMenu)}
                  className="flex items-center gap-1 px-4 py-2 bg-[#38d6b7] text-white rounded-md hover:bg-[#2bb29b] transition-all duration-300 shadow-md hover:shadow-lg text-sm"
                >
                  <Wallet size={14} />
                  <span>New Payment</span>
                </button>
                {showPaymentMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-10">
                    <button
                      onClick={() => {
                        navigate('/new-payment/one-off');
                        setShowPaymentMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-[#e6f0ee] flex items-center gap-2 text-sm"
                    >
                      <PlusCircle size={14} />
                      <span>One-off Payment</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate('/new-payment/regular');
                        setShowPaymentMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-[#e6f0ee] flex items-center gap-2 text-sm"
                    >
                      <PiggyBank size={14} />
                      <span>Regular Payment</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {portfolioHistory.length > 0 ? (
          <PerformanceGraph portfolioHistory={portfolioHistory} title="Account Performance" />
        ) : (
          <div className="col-span-2 bg-white rounded-2xl shadow-lg p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-600 mb-4">Performance Graph Not Available</h2>
            <p className="text-gray-400">No historical data available for this account's performance.</p>
          </div>
        )}

        {holdings.length > 0 ? (
          <>
            <HoldingsTable holdings={holdings} />
            <PieChart data={pieData} />
          </>
        ) : (
          <div className="col-span-2 text-center bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">No Holdings</h2>
            <p className="text-gray-600">This account currently has no holdings to display.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;