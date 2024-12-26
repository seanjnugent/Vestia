import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sparkles, PlusCircle, History, PiggyBank, Wallet, RefreshCw } from 'lucide-react';
import AnnualAllowance from '../components/AnnualAllowance';
import PerformanceGraph from '../components/PerformanceGraph';
import { BeatLoader } from 'react-spinners';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';

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
  
        const endDate = today.toISOString();
        const startDate = ninetyDaysAgo.toISOString();
  
        const [accountResponse, historyResponse, holdingsResponse] = await Promise.all([
          fetch(`http://localhost:5000/api/accounts/account-summary/${id}`),
          fetch(`http://localhost:5000/api/accounts/account-history/${id}`),
          fetch(`http://localhost:5000/api/accounts/account-holdings/${id}`)
        ]);
  
        if (!accountResponse.ok || !historyResponse.ok) {
          throw new Error('Failed to fetch data');
        }
  
        const [accountData, historyData] = await Promise.all([
          accountResponse.json(),
          historyResponse.json()
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
  

        // Parse the Performance JSON data
        const performanceData = historyData[0]?.performance_history || [];

        setPortfolioHistory(
          performanceData.map((d) => ({
            date: d.date, // Keep as ISO string
            total_asset_value: parseFloat(d.total_asset_value),
            cash_balance: parseFloat(d.cash_balance),
          }))
        );
  
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-pink-50 to-white">
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

  const pieData = {
    labels: holdings.map((holding) => holding.asset_code),
    datasets: [
      {
        label: 'Holdings',
        data: holdings.map((holding) => holding.asset_value),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      },
    ],
  };

  const latestPortfolioValue = portfolioHistory.length > 0 ? 
    portfolioHistory[portfolioHistory.length - 1].value : 0;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Account Summary */}
      <div
        className={`bg-white rounded-xl shadow-lg p-6 ${
          isManaged ? 'bg-gradient-to-r from-pink-50/50 to-violet-50/50' : ''
        }`}
      >
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-violet-500 text-transparent bg-clip-text flex items-center gap-2">
              {accountDetails?.account_name}
              <Sparkles className="w-6 h-6 text-pink-500" />
            </h1>
            {isManaged && (
              <div className="mt-2">
                <span className="px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-sm">
                  {accountDetails?.managed_portfolio_name}
                </span>
                <p className="text-gray-600 mt-2">Managed by Vestia</p>
              </div>
            )}
          </div>

          <div className="text-right space-y-2">
  <p className="text-2xl font-semibold">
    £{Number(accountDetails?.total_account_value || 0).toLocaleString()}
  </p>
  <p className="text-gray-600 font-medium">
    Cash Available: £{Number(accountDetails?.cash_balance_sum || 0).toLocaleString()}
  </p>
            {/* Action Buttons */}
            <div className="flex gap-2 mt-4 justify-end relative">
              <button
                onClick={() => navigate('/new-trade')}
                className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-pink-500 to-violet-500 text-white rounded-md hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg text-sm"
              >
                <RefreshCw size={14} />
                <span>New Trade</span>
              </button>
              <button
                onClick={() => setShowPaymentMenu(!showPaymentMenu)}
                className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-pink-500 to-violet-500 text-white rounded-md hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg text-sm"
              >
                <Wallet size={14} />
                <span>New Payment</span>
              </button>
              {showPaymentMenu && (
                <div className="absolute mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-10">
                  <button
                    onClick={() => {
                      navigate('/new-payment/one-off');
                      setShowPaymentMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-violet-50 flex items-center gap-2 text-sm"
                  >
                    <PlusCircle size={14} />
                    <span>One-off Payment</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate('/new-payment/regular');
                      setShowPaymentMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-violet-50 flex items-center gap-2 text-sm"
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

      {/* Graphs and Allowance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnnualAllowance accountDetails={accountDetails} />
        <PerformanceGraph portfolioHistory={portfolioHistory} />
      </div>

      {/* Holdings Table and Pie Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {holdings.length > 0 ? (
          <>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Holdings</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Asset</th>
                      <th className="text-right py-3 px-4">Units Held</th>
                      <th className="text-right py-3 px-4">Value (£)</th>
                      <th className="text-right py-3 px-4">Net Performance (£)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {holdings.map((holding, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{holding.asset_code}</td>
                        <td className="py-3 px-4 text-right">
                          {Number(holding.asset_holding).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          £{Number(holding.asset_value).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          £{Number(holding.net_performance).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Holdings Distribution</h2>
              <Pie data={pieData} />
            </div>
          </>
        ) : (
          <div className="col-span-2 text-center bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">No Holdings</h2>
            <p className="text-gray-600">This account currently has no holdings to display.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;