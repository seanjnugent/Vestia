import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // Import for animations

const Accounts = () => {
  const navigate = useNavigate();

  // Example accounts data
  const accounts = [
    { id: 1, name: 'Savings Account', type: 'Savings', value: '£12,340' },
    { id: 2, name: 'Checking Account', type: 'Checking', value: '£4,560' },
    { id: 3, name: 'Investment Account', type: 'Investment', value: '£22,450' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 bg-gradient-to-b from-pink-50 to-white min-h-screen"
      style={{
        backgroundImage: 'url("https://www.example.com/path/to/your/background-pattern.svg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 drop-shadow-lg">My Accounts ✨</h1>
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
            <th className="p-4 text-left font-medium text-gray-600">Account Name</th>
            <th className="p-4 text-left font-medium text-gray-600">Account Type</th>
            <th className="p-4 text-left font-medium text-gray-600">Account Value</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account, index) => (
            <motion.tr
              key={account.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`cursor-pointer hover:bg-gray-100 ${
                index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
              }`}
              onClick={() => navigate(`/account/${account.id}`)}
            >
              <td className="p-4 text-gray-700">{account.name}</td>
              <td className="p-4 text-gray-700">{account.type}</td>
              <td className="p-4 text-gray-700">{account.value}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default Accounts;
