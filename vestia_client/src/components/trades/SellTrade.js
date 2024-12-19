import React, { useState, useMemo, useCallback } from "react";
import { ChevronRight, ChevronLeft, Search } from "lucide-react";
import { motion } from "framer-motion";

const SellTrade = ({ stage, setStage, account }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [tradeQuantities, setTradeQuantities] = useState({});
  const [inputType, setInputType] = useState('units');

  const heldAssets = [
    { code: "AAPL", name: "Apple Inc.", units: 10, currentPrice: 145.05, totalValue: 1450.50, performance: "+2.3%" },
    { code: "MSFT", name: "Microsoft", units: 15, currentPrice: 200.20, totalValue: 3003.00, performance: "+1.8%" }
  ];

  const filteredAssets = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return heldAssets.filter(asset => 
      asset.name.toLowerCase().includes(search) || 
      asset.code.toLowerCase().includes(search)
    );
  }, [searchTerm]);

  const calculateTotalValue = useCallback(() => {
    return Object.entries(tradeQuantities).reduce((total, [code, quantity]) => {
      const asset = heldAssets.find(a => a.code === code);
      if (inputType === 'percentage') {
        return total + ((quantity / 100) * asset.units * asset.currentPrice);
      }
      return total + (quantity * asset.currentPrice);
    }, 0);
  }, [tradeQuantities, inputType]);

  const renderAssetSelection = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Search held assets..."
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
              <p className="text-xs text-gray-500">Held: {asset.units} units</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">${asset.currentPrice.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Total: ${asset.totalValue.toLocaleString()}</p>
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
        <div className="flex justify-between items-center mb-4">
          <label className="block text-sm font-medium text-gray-700">Enter Amount</label>
          <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => {
                setInputType('units');
                setTradeQuantities({});
              }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                inputType === 'units'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Units
            </button>
            <button
              onClick={() => {
                setInputType('percentage');
                setTradeQuantities({});
              }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                inputType === 'percentage'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Percentage
            </button>
          </div>
        </div>
        <div className="space-y-2">
          {selectedAssets.map(asset => (
            <div key={asset.code} className="flex items-center justify-between">
              <div>
                <p className="font-bold">{asset.name} ({asset.code})</p>
                <p className="text-sm text-gray-500">
                  Held: {asset.units} units (${(asset.units * asset.currentPrice).toLocaleString()})
                </p>
              </div>
              <div className="relative">
                <input
                  type="number"
                  value={tradeQuantities[asset.code] || ""}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    const maxValue = inputType === 'units' ? asset.units : 100;
                    
                    if (!isNaN(value) && value >= 0 && value <= maxValue) {
                      setTradeQuantities(prev => ({
                        ...prev,
                        [asset.code]: value
                      }));
                    }
                  }}
                  placeholder={inputType === 'units' ? "0" : "0"}
                  className="w-24 p-2 rounded-xl border-2 focus:border-blue-500 text-right"
                />
                {inputType === 'percentage' && (
                  <span className="absolute right-3 top-2.5 text-gray-500">%</span>
                )}
              </div>
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
          disabled={Object.values(tradeQuantities).every(val => !val)}
          className={`py-3 px-6 rounded-xl transition-all ${
            Object.values(tradeQuantities).every(val => !val) ? 'bg-gray-300 text-gray-500' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
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
          <p><strong>Trade Type:</strong> Sell ({inputType})</p>
          {selectedAssets.map(asset => {
            const quantity = tradeQuantities[asset.code];
            const actualUnits = inputType === 'percentage' 
              ? (quantity / 100) * asset.units 
              : quantity;
            
            return (
              <p key={asset.code}>
                <strong>{asset.name}</strong> ({asset.code}): {
                  inputType === 'percentage' 
                    ? `${quantity}% (${actualUnits.toFixed(2)} units)` 
                    : `${quantity} units`
                }
              </p>
            );
          })}
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

export default SellTrade;