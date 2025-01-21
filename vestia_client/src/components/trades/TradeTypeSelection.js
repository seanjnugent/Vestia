import React from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

const TradeTypeSelection = ({ tradeType, setTradeType, onContinue }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h2 className="text-xl font-bold text-gray-900">Select Trade Type</h2>
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setTradeType("buy")}
          className={`p-6 rounded-xl border-2 text-center transition-all ${
            tradeType === "buy"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 hover:border-blue-300"
          }`}
        >
          <h3 className="font-bold text-lg">Buy</h3>
          <p className="text-sm text-gray-500">Purchase new assets</p>
        </button>
        <button
          onClick={() => setTradeType("sell")}
          className={`p-6 rounded-xl border-2 text-center transition-all ${
            tradeType === "sell"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 hover:border-blue-300"
          }`}
        >
          <h3 className="font-bold text-lg">Sell</h3>
          <p className="text-sm text-gray-500">Sell held assets</p>
        </button>
      </div>
      <button
        onClick={onContinue}
        disabled={!tradeType}
        className={`w-full py-3 rounded-xl transition-all ${
          tradeType
            ? "bg-blue-500 text-white hover:bg-blue-600"
            : "bg-gray-300 text-gray-500"
        }`}
      >
        Continue
      </button>
    </motion.div>
  );
};

TradeTypeSelection.propTypes = {
  tradeType: PropTypes.string,
  setTradeType: PropTypes.func.isRequired,
  onContinue: PropTypes.func.isRequired,
};

export default TradeTypeSelection;