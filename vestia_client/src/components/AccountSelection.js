import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BeatLoader } from "react-spinners";
import PropTypes from "prop-types";

const AccountSelection = ({ selectedAccount, setSelectedAccount, onContinue }) => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClientAccounts = async () => {
      const clientId = localStorage.getItem("userId");
      if (!clientId) {
        setError("No user ID found. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/api/accounts/getClientAccounts/${clientId}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch accounts: ${response.statusText}`);
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

  if (accounts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-700 text-xl">No accounts found.</div>
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
            <motion.button
              key={acc.account_id}
              onClick={() => setSelectedAccount(acc)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                selectedAccount?.account_id === acc.account_id
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
            </motion.button>
          ))}
        </div>
      </div>
      <motion.button
        onClick={onContinue}
        disabled={!selectedAccount}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full py-3 rounded-xl transition-all ${
          selectedAccount
            ? "bg-blue-500 text-white hover:bg-blue-600"
            : "bg-gray-300 text-gray-500"
        }`}
      >
        Continue
      </motion.button>
    </motion.div>
  );
};

AccountSelection.propTypes = {
  selectedAccount: PropTypes.object,
  setSelectedAccount: PropTypes.func.isRequired,
  onContinue: PropTypes.func.isRequired,
};

export default AccountSelection;