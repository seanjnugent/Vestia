import React, { useState, useMemo, useCallback } from "react";
import { ChevronRight, ChevronLeft, Search } from "lucide-react";
import { motion } from "framer-motion";

const NewTrade = () => {
  const accounts = [
    { id: "investment", name: "Investment Account", balance: 25000, type: "Margin", buyingPower: 50000 },
    { id: "retirement", name: "Retirement Account", balance: 15000, type: "401k", buyingPower: 30000 }
  ];

  const heldAssets = [
    { code: "AAPL", name: "Apple Inc.", units: 10, currentPrice: 145.05, totalValue: 1450.50, performance: "+2.3%" },
    { code: "MSFT", name: "Microsoft", units: 15, currentPrice: 200.20, totalValue: 3003.00, performance: "+1.8%" }
  ];

  const availableAssets = [
    { code: "TSLA", name: "Tesla", currentPrice: 850.75, changePercent: "+4.2%", sector: "Automotive" },
    { code: "GOOGL", name: "Alphabet", currentPrice: 2800.50, changePercent: "+3.1%", sector: "Technology" },
    { code: "AMZN", name: "Amazon", currentPrice: 3200.25, changePercent: "+2.7%", sector: "E-commerce" },
    { code: "META", name: "Meta Platforms", currentPrice: 300.40, changePercent: "+1.5%", sector: "Technology" }
  ];

  const [stage, setStage] = useState(0);
  const [account, setAccount] = useState("");
  const [tradeType, setTradeType] = useState("buy");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [tradeQuantities, setTradeQuantities] = useState({});
  const [sellByPercentage, setSellByPercentage] = useState(false);

  const ProgressTracker = ({ currentStage }) => {
    const steps = ["Account", "Asset", "Amount", "Review"];
    const numSteps = steps.length;

    const currentStepBounded = Math.max(1, Math.min(currentStage, numSteps));
    const progress = numSteps > 1 ? ((currentStepBounded - 1) / (numSteps - 1)) * 100 : currentStepBounded === 1 ? 100 : 0;

    return (
      <div className="relative mb-8 px-4">
        <div className="w-full h-2 bg-gray-300 rounded-full">
          <div
            className="h-2 bg-gradient-to-r from-[#ff6b6b] via-[#ffa500] to-[#ffff00] rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between absolute top-0 left-0 right-0 -mt-6 w-full">
        </div>
      </div>
    );
  };

  const filteredAssets = useMemo(() => {
    const search = searchTerm.toLowerCase();
    const assetList = tradeType === "buy" ? availableAssets : heldAssets;
    return assetList.filter(asset => 
      asset.name.toLowerCase().includes(search) || 
      asset.code.toLowerCase().includes(search)
    );
  }, [searchTerm, tradeType]);

  const calculateTotalValue = useCallback(() => {
    return Object.entries(tradeQuantities).reduce((total, [code, quantity]) => {
      const asset = tradeType === "buy" 
        ? availableAssets.find(a => a.code === code)
        : heldAssets.find(a => a.code === code);
      return total + (quantity * asset.currentPrice);
    }, 0);
  }, [tradeQuantities, tradeType]);

  const renderStageContent = () => {
    switch(stage) {
      case 0:
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Trading Account</label>
              <div className="space-y-3">
                {accounts.map(acc => (
                  <button
                    key={acc.id}
                    onClick={() => setAccount(acc.id)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      account === acc.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-lg">{acc.name}</h3>
                        <p className="text-sm text-gray-500">{acc.type} Account</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">${acc.balance.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Buying Power: ${acc.buyingPower.toLocaleString()}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => setStage(1)}
              disabled={!account}
              className={`w-full py-3 rounded-xl transition-all ${
                account ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500'}`}
            >
              Continue <ChevronRight className="inline ml-2" />
            </button>
          </motion.div>
        );

      case 1:
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="flex justify-between mb-4">
              {["buy", "sell"].map(type => (
                <button
                  key={type}
                  onClick={() => {
                    setTradeType(type);
                    setSelectedAssets([]);
                    setTradeQuantities({});
                  }}
                  className={`w-1/2 py-3 rounded-xl transition-all capitalize ${
                    tradeType === type ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder={`Search ${tradeType === 'buy' ? 'available' : 'held'} assets...`}
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
                    {tradeType === "sell" && <p className="text-xs text-gray-500">Held: {asset.units} units</p>}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${asset.currentPrice.toLocaleString()}</p>
                    {tradeType === "buy" && <p className={`text-sm ${asset.changePercent.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{asset.changePercent}</p>}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStage(0)}
                className="text-gray-500 hover:text-gray-700 transition-all"
              >
                <ChevronLeft className="inline mr-2" /> Back
              </button>

              <button
                onClick={() => setStage(2)}
                disabled={selectedAssets.length === 0}
                className={`py-3 rounded-xl transition-all ${
                  selectedAssets.length > 0 ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500'}`}
              >
                Continue <ChevronRight className="inline ml-2" />
              </button>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Enter Quantity</label>
              {selectedAssets.map(asset => (
                <div key={asset.code} className="flex justify-between items-center mb-2">
                  <p className="font-semibold">{asset.name}</p>
                  <input
                    type="number"
                    value={tradeQuantities[asset.code] || ''}
                    onChange={(e) => setTradeQuantities({
                      ...tradeQuantities,
                      [asset.code]: e.target.value
                    })}
                    className="w-16 px-2 py-1 border rounded-md text-center"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={() => setStage(3)}
              disabled={Object.keys(tradeQuantities).length === 0}
              className={`w-full py-3 rounded-xl transition-all ${
                Object.keys(tradeQuantities).length > 0 ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500'}`}
            >
              Continue <ChevronRight className="inline ml-2" />
            </button>
          </motion.div>
        );

      case 3:
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <h2 className="text-xl font-bold">Review Your Trade</h2>
            <div>
              <p>Account: {accounts.find(acc => acc.id === account)?.name}</p>
              <p>Trade Type: {tradeType}</p>
              <p>Selected Assets:</p>
              <ul>
                {selectedAssets.map(asset => (
                  <li key={asset.code}>
                    {asset.name} - {tradeQuantities[asset.code]} units
                  </li>
                ))}
              </ul>
              <p>Total Value: ${calculateTotalValue().toLocaleString()}</p>
            </div>

            <button
              onClick={() => alert('Trade Complete!')}
              className="w-full py-3 rounded-xl bg-green-500 text-white hover:bg-green-600 transition-all"
            >
              Complete Trade
            </button>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <ProgressTracker currentStage={stage + 1} />
      {renderStageContent()}
    </div>
  );
};

export default NewTrade;
