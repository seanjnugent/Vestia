import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BeatLoader } from "react-spinners";

const AccountSelection = ({ onContinue }) => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClientAccounts = async () => {
      const clientId = localStorage.getItem("userId");
      if (!clientId) {
        setError("No user ID found");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/api/accounts/client-accounts/${clientId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch accounts");
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Trading Account
        </label>
        <div className="space-y-3">
          {accounts.map((acc) => (
            <button
              key={acc.account_id}
              onClick={() => setSelectedAccount(acc.account_id)}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                selectedAccount === acc.account_id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg">{acc.account_name}</h3>
                  <p className="text-sm text-gray-500">{acc.account_type} Account</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">
                    £{Number(acc.total_account_value).toLocaleString("en-GB")}
                  </p>
                  <p className="text-xs text-gray-500">
                    Available Cash: £{Number(acc.cash_balance_sum).toLocaleString("en-GB")}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      <button
        onClick={() => onContinue(selectedAccount)}
        disabled={!selectedAccount}
        className={`w-full py-3 rounded-xl transition-all ${
          selectedAccount
            ? "bg-blue-500 text-white hover:bg-blue-600"
            : "bg-gray-300 text-gray-500"
        }`}
      >
        Continue
      </button>
    </motion.div>
  );
};

export default AccountSelection;
