import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sparkles, PlusCircle, History, PiggyBank, Wallet, RefreshCw } from 'lucide-react';
import AnnualAllowance from '../components/AnnualAllowance';
import PerformanceGraph from '../components/PerformanceGraph';
import { BeatLoader } from 'react-spinners';

const Account = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [accountDetails, setAccountDetails] = useState(null);
  const [portfolioHistory, setPortfolioHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPaymentMenu, setShowPaymentMenu] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const today = new Date();
        const ninetyDaysAgo = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);

        const endDate = new Date();
        const [accountResponse, historyResponse] = await Promise.all([
          fetch(`http://localhost:5000/api/accounts/account-summary/${id}`),
          fetch(
            `http://localhost:5000/api/accounts/account-history/${id}?startDate=${ninetyDaysAgo.toISOString().split('T')[0]}&endDate=${endDate.toISOString().split('T')[0]}`
          ),
        ]);

        if (!accountResponse.ok || !historyResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const [accountData, historyData] = await Promise.all([
          accountResponse.json(),
          historyResponse.json(),
        ]);

        if (Array.isArray(accountData) && accountData.length > 0) {
          setAccountDetails(accountData[0]);
        }

        setPortfolioHistory(
          historyData.map((d) => ({
            date: new Date(d.value_date).toLocaleDateString(),
            value: d.total_portfolio_value,
            assets: d.total_asset_value,
            cash: d.total_cash_value,
          }))
        );
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
              £{Number(portfolioHistory[portfolioHistory.length - 1]?.value || 0).toLocaleString()}
            </p>
            <p className="text-green-500 font-medium">
              +£{Number(accountDetails?.yearChange || 0).toLocaleString()} ({accountDetails?.yearPercentage || '+0%'})
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

      {/* Transaction History */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <History className="w-5 h-5 text-pink-500" />
          <h2 className="text-xl font-semibold">Transaction History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-left py-3 px-4">Type</th>
                <th className="text-right py-3 px-4">Amount</th>
              </tr>
            </thead>
            <tbody>
              {accountDetails?.transactions?.map((transaction, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{transaction.date}</td>
                  <td className="py-3 px-4">{transaction.type}</td>
                  <td className="py-3 px-4 text-right">£{Number(transaction.amount).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Account;
