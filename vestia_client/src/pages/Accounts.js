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
        const response = await fetch(`http://localhost:5000/api/accounts/getClientAccounts/${clientId}`);
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
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <BeatLoader color="#00836f" size={15} />
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
      className="min-h-screen bg-gray-50 font-sans"
    >
      <div className="max-w-5xl mx-auto py-12 px-6 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold text-[#00836f]">
            My Accounts
          </h1>
          <button
            className="px-4 py-2 bg-[#00836f] text-white rounded-md shadow hover:bg-[#006a59] focus:ring-2 focus:ring-[#38d6b7]"
            onClick={() => navigate("/new-account")}
          >
            Create New Account
          </button>
        </div>
        <div className="overflow-hidden rounded-lg shadow">
          <table className="w-full border-collapse bg-white">
            <thead className="bg-[#f1f5f9]">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Account ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Account Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Account Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Account Value</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account, index) => (
                <motion.tr
                  key={account.account_id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`hover:bg-[#f9fafb] ${
                    index % 2 === 0 ? 'bg-white' : 'bg-[#f6f8fa]'
                  }`}
                  onClick={() => navigate(`/account/${account.account_id}`)}
                >
                  <td className="px-4 py-3 text-sm text-gray-800 border-b">
                    {`A${account.account_id.toString().padStart(8, '0')}`}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800 border-b">{account.account_name}</td>
                  <td className="px-4 py-3 text-sm text-gray-800 border-b">{account.account_type}</td>
                  <td className="px-4 py-3 text-sm text-gray-800 border-b">
                    £{Number(account.total_account_value).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default Accounts;
