import React, { useState, useMemo, useCallback } from "react";
import { 
  ChevronRight, 
  ChevronLeft, 
  Search 
} from "lucide-react";
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

      case 2:
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <h2 className="text-2xl font-bold text-center mb-4">{tradeType === 'buy' ? 'Buy' : 'Sell'} Order Details</h2>

            <div className="flex justify-end space-x-4 mb-4">
              {tradeType === "sell" && (
                <>
                  <button
                    onClick={() => setSellByPercentage(false)}
                    className={`py-2 px-4 rounded-xl transition-all ${
                      !sellByPercentage ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                  >
                    Units
                  </button>
                  <button
                    onClick={() => setSellByPercentage(true)}
                    className={`py-2 px-4 rounded-xl transition-all ${
                      sellByPercentage ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`} > Percentage </button> </> )} </div>


<div className="space-y-4">
{selectedAssets.map(asset => (
  <div key={asset.code} className="p-4 rounded-xl border-2">
    <h3 className="font-bold text-lg">{asset.name}</h3>
    <p className="text-sm text-gray-500 mb-2">{asset.code}</p>
    {tradeType === "sell" && (
      <p className="text-xs text-gray-500 mb-4">
        Held: {asset.units} units (${(asset.units * asset.currentPrice).toFixed(2)})
      </p>
    )}
    <div className="flex items-center space-x-4">
      <input
        type="number"
        min="0"
        max={tradeType === "sell" ? (sellByPercentage ? 100 : asset.units) : undefined}
        step={sellByPercentage ? 1 : 0.01}
        placeholder={sellByPercentage ? "Enter %" : "Enter units"}
        value={tradeQuantities[asset.code] || ""}
        onChange={(e) =>
          setTradeQuantities({
            ...tradeQuantities,
            [asset.code]: e.target.value,
          })
        }
        className="w-full px-4 py-2 border rounded-xl focus:border-blue-500"
      />
      <span className="text-sm text-gray-500">
        {sellByPercentage ? "%" : "units"}
      </span>
    </div>
  </div>
))}
</div>

<div className="flex justify-between mt-4">
<button
  onClick={() => setStage(1)}
  className="text-gray-500 hover:text-gray-700 flex items-center"
>
  <ChevronLeft className="mr-2" /> Back
</button>
<button
  onClick={() => alert(`Trade submitted for $${calculateTotalValue().toFixed(2)}`)}
  disabled={!Object.values(tradeQuantities).some((q) => q > 0)}
  className={`py-3 px-6 rounded-xl transition-all ${
    Object.values(tradeQuantities).some((q) => q > 0)
      ? "bg-blue-500 text-white hover:bg-blue-600"
      : "bg-gray-300 text-gray-500"
  }`}
>
  Confirm
</button>
</div>
</motion.div>
);

default:
return null;
}
};

return ( <div className="max-w-lg mx-auto p-6"> <h1 className="text-3xl font-bold text-center mb-6">New Trade</h1> {renderStageContent()} </div> ); };

export default NewTrade;