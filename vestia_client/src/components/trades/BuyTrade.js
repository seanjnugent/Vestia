import React, { useState, useMemo, useCallback } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import AssetSelection from "../AssetSelection";

const BuyTrade = ({ stage, setStage, account }) => {
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [tradeQuantities, setTradeQuantities] = useState({});

  const calculateTotalValue = useCallback(() => {
    return Object.entries(tradeQuantities).reduce((total, [code, quantity]) => {
      const asset = selectedAssets.find(a => a.asset_code === code);
      return total + (quantity * parseFloat(asset.latest_price));
    }, 0);
  }, [tradeQuantities, selectedAssets]);

  const submitTrade = async () => {
    const tradeData = {
      account_id: account.account_id,
      asset_codes: selectedAssets.map(asset => asset.asset_code), // Use asset_code
      quantities: selectedAssets.map(asset => tradeQuantities[asset.asset_code]),
      description: "Buy trade",
      status: "Completed"
    };

    try {
      const response = await fetch("http://localhost:5000/api/trades/buy-trade", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tradeData),
      });

      if (response.ok) {
        alert("Trade submitted successfully!");
        setStage(0); // Reset or move to another screen
      } else {
        alert("Failed to submit trade.");
      }
    } catch (error) {
      console.error("Error submitting trade:", error);
    }
  };

  const renderAssetSelection = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <AssetSelection selectedAssets={selectedAssets} setSelectedAssets={setSelectedAssets} />
      
      <div className="flex justify-between">
        <button
          onClick={() => setStage(0)}
          className="text-gray-500 hover:text-gray-700 flex items-center"
        >
          <ChevronLeft className="mr-2" /> Back
        </button>
        <button
          onClick={() => setStage(2)}
          disabled={selectedAssets.length === 0}
          className={`py-3 px-6 rounded-xl transition-all ${
            selectedAssets.length > 0 ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500'
          }`}
        >
          Next <ChevronRight className="inline ml-2" />
        </button>
      </div>
    </motion.div>
  );

  const renderAmountInput = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Enter Amount</label>
        <div className="space-y-2">
          {selectedAssets.map(asset => (
            <div key={asset.asset_id} className="flex items-center justify-between">
              <div>
                <p className="font-bold">{asset.asset_name} ({asset.asset_code})</p>
                <p className="text-sm text-gray-500">Price: ${parseFloat(asset.latest_price).toLocaleString()}</p>
              </div>
              <input
                type="number"
                value={tradeQuantities[asset.asset_code] || ""}
                onChange={(e) => {
                  const quantity = e.target.value;
                  setTradeQuantities(prev => ({
                    ...prev,
                    [asset.asset_code]: quantity ? parseFloat(quantity) : 0
                  }));
                }}
                className="w-20 p-2 rounded-xl border-2 focus:border-blue-500 text-right"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setStage(1)}
          className="text-gray-500 hover:text-gray-700 flex items-center"
        >
          <ChevronLeft className="mr-2" /> Back
        </button>
        <button
          onClick={() => setStage(3)}
          disabled={Object.values(tradeQuantities).every(val => val === 0)}
          className={`py-3 px-6 rounded-xl transition-all ${
            Object.values(tradeQuantities).every(val => val === 0) ? 'bg-gray-300 text-gray-500' : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          Next <ChevronRight className="inline ml-2" />
        </button>
      </div>
    </motion.div>
  );

  const renderReview = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <h2 className="text-xl font-semibold">Review Your Trade</h2>
      <div className="space-y-4">
        <div className="p-4 border-2 rounded-xl">
          <p><strong>Account:</strong> {account.account_name}</p>
          <p><strong>Assets:</strong> {selectedAssets.map(asset => (
            <span key={asset.asset_id}>
              {asset.asset_name} ({tradeQuantities[asset.asset_code]} units)
            </span>
          ))}</p>
          <p><strong>Total Value:</strong> £{calculateTotalValue().toLocaleString()}</p>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setStage(2)}
          className="text-gray-500 hover:text-gray-700 flex items-center"
        >
          <ChevronLeft className="mr-2" /> Back
        </button>
        <button
          onClick={submitTrade}
          className="py-3 px-6 rounded-xl bg-green-500 text-white hover:bg-green-600"
        >
          Confirm Trade
        </button>
      </div>
    </motion.div>
  );

  switch (stage) {
    case 0:
      return null;
    case 1:
      return renderAssetSelection();
    case 2:
      return renderAmountInput();
    case 3:
      return renderReview();
    default:
      return null;
  }
};

export default BuyTrade;