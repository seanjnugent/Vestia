import React, { useState, useMemo, useCallback } from "react";
import { ChevronRight, ChevronLeft, Search } from "lucide-react";
import { motion } from "framer-motion";

const BuyTrade = ({ stage, setStage, account }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [tradeQuantities, setTradeQuantities] = useState({});

  const availableAssets = [
    { code: "TSLA", name: "Tesla", currentPrice: 850.75, changePercent: "+4.2%", sector: "Automotive" },
    { code: "GOOGL", name: "Alphabet", currentPrice: 2800.50, changePercent: "+3.1%", sector: "Technology" },
    { code: "AMZN", name: "Amazon", currentPrice: 3200.25, changePercent: "+2.7%", sector: "E-commerce" },
    { code: "META", name: "Meta Platforms", currentPrice: 300.40, changePercent: "+1.5%", sector: "Technology" }
  ];

  const filteredAssets = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return availableAssets.filter(asset => 
      asset.name.toLowerCase().includes(search) || 
      asset.code.toLowerCase().includes(search)
    );
  }, [searchTerm]);

  const calculateTotalValue = useCallback(() => {
    return Object.entries(tradeQuantities).reduce((total, [code, quantity]) => {
      const asset = availableAssets.find(a => a.code === code);
      return total + (quantity * asset.currentPrice);
    }, 0);
  }, [tradeQuantities]);

  const renderAssetSelection = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Search available assets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 pl-10 border-2 rounded-xl focus:border-blue-500 transition-all"
        />
        <Search className="absolute left-3 top-3.5 text-gray-400" />
      </div>

      <div className="max-h-64 overflow-y-auto space-y-2">
        {filteredAssets.map(asset => (
          <div
            key={asset.code}
            onClick={() => {
              const isSelected = selectedAssets.some(a => a.code === asset.code);
              setSelectedAssets(
                isSelected ? selectedAssets.filter(a => a.code !== asset.code) : [...selectedAssets, asset]
              );
            }}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex justify-between items-center ${
              selectedAssets.some(a => a.code === asset.code) 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300'}`}
          >
            <div>
              <p className="font-bold">{asset.name}</p>
              <p className="text-sm text-gray-500">{asset.code}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">${asset.currentPrice.toLocaleString()}</p>
              <p className={`text-sm ${asset.changePercent.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                {asset.changePercent}
              </p>
            </div>
          </div>
        ))}
      </div>

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
            selectedAssets.length > 0 ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500'}`}
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
            <div key={asset.code} className="flex items-center justify-between">
              <div>
                <p className="font-bold">{asset.name} ({asset.code})</p>
                <p className="text-sm text-gray-500">Price: ${asset.currentPrice.toLocaleString()}</p>
              </div>
              <input
                type="number"
                value={tradeQuantities[asset.code] || ""}
                onChange={(e) => {
                  const quantity = e.target.value;
                  setTradeQuantities(prev => ({
                    ...prev,
                    [asset.code]: quantity ? parseFloat(quantity) : 0
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
            Object.values(tradeQuantities).every(val => val === 0) ? 'bg-gray-300 text-gray-500' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
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
          <p><strong>Account:</strong> {account.name}</p>
          <p><strong>Trade Type:</strong> Buy</p>
          {selectedAssets.map(asset => (
            <p key={asset.code}><strong>{asset.name}</strong> ({asset.code}): {tradeQuantities[asset.code]} units</p>
          ))}
          <p className="font-semibold text-lg">Total Value: ${calculateTotalValue().toLocaleString()}</p>
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
          onClick={() => alert('Trade submitted!')}
          className="py-3 px-6 rounded-xl bg-green-500 text-white hover:bg-green-600"
        >
          Confirm
        </button>
      </div>
    </motion.div>
  );

  switch(stage) {
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