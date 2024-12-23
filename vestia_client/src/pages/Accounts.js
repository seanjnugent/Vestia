import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BeatLoader } from 'react-spinners';

const Accounts = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClientAccounts = async () => {
      const clientId = localStorage.getItem('userId');
      if (!clientId) {
        setError('No user ID found');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/accounts/client-accounts/${clientId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch accounts');
        }
        const data = await response.json();
        setAccounts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClientAccounts();
  }, []);

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-white font-sans"
    >
      <div className="max-w-7xl mx-auto py-12 px-6 lg:px-8 space-y-12">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            My Accounts
          </h1>
          <button
            className="px-4 py-2 bg-gradient-to-r from-[#ff6b6b] via-[#ffa500] to-[#ffff00] text-white rounded-lg shadow-md hover:bg-gradient-to-r hover:from-[#ff6b6b] hover:via-[#ffa500] hover:to-[#ffff00]"
            onClick={() => navigate("/new-account")}
          >
            Create New Account
          </button>
        </div>
        <table className="w-full rounded-lg shadow-md overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left font-medium text-gray-600">Account ID</th>
              <th className="p-4 text-left font-medium text-gray-600">Account Name</th>
              <th className="p-4 text-left font-medium text-gray-600">Account Type</th>
              <th className="p-4 text-left font-medium text-gray-600">Account Value</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account, index) => (
              <motion.tr
                key={account.account_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`cursor-pointer hover:bg-gray-100 ${
                  index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                }`}
                onClick={() => navigate(`/account/${account.account_id}`)}
              >
                <td className="p-4 text-gray-700">
                  {`A${account.account_id.toString().padStart(8, '0')}`}
                </td>
                <td className="p-4 text-gray-700">{account.account_name}</td>
                <td className="p-4 text-gray-700">{account.account_type}</td>
                <td className="p-4 text-gray-700">
                  £{Number(account.total_account_value).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default Accounts;