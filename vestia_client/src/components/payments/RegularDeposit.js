import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

const RegualarDeposit = ({ onComplete, account }) => {
  const [stage, setStage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [transaction, setTransaction] = useState({
    source: null,
    amount: "",
    frequency: "",
    startDate: "",
    assetAllocations: {},
  });

  // Sample assets data - replace with your actual assets data
  const assets = [
    { code: "AAPL", name: "Apple Inc.", units: 10, currentPrice: 150.50, totalValue: 1505.00 },
    { code: "GOOGL", name: "Alphabet Inc.", units: 5, currentPrice: 2800.00, totalValue: 14000.00 },
    { code: "MSFT", name: "Microsoft Corp.", units: 15, currentPrice: 320.00, totalValue: 4800.00 },
  ];

  const filteredAssets = assets.filter(asset =>
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paymentSources = [
    { id: "bank1", name: "Chase Checking ****1234" },
    { id: "bank2", name: "Wells Fargo Savings ****5678" }
  ];

  const frequencies = [
    { id: "weekly", label: "Weekly", description: "Every week on the same day" },
    { id: "monthly", label: "Monthly", description: "Every month on the same date" },
    { id: "quarterly", label: "Quarterly", description: "Every three months" }
  ];

  const renderSourceSelection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Select Payment Source</h2>
      <div className="space-y-4">
        {paymentSources.map((source) => (
          <button
            key={source.id}
            onClick={() => {
              setTransaction(prev => ({ ...prev, source: source.id }));
              setStage(2);
            }}
            className="w-full p-4 rounded-lg border hover:border-blue-500 transition-all"
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">{source.name}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderAmountAndFrequency = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Set Amount & Frequency</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Regular Payment Amount
          </label>
          <input
            type="number"
            value={transaction.amount}
            onChange={(e) => setTransaction(prev => ({ ...prev, amount: e.target.value }))}
            className="w-full p-3 border rounded-lg"
            placeholder="Enter amount"
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Frequency
          </label>
          <div className="space-y-3">
            {frequencies.map((freq) => (
              <button
                key={freq.id}
                onClick={() => setTransaction(prev => ({ ...prev, frequency: freq.id }))}
                className={`w-full p-4 rounded-lg border transition-all ${
                  transaction.frequency === freq.id 
                    ? "border-blue-500 bg-blue-50" 
                    : "hover:border-blue-300"
                }`}
              >
                <div className="flex flex-col items-start">
                  <span className="font-medium">{freq.label}</span>
                  <span className="text-sm text-gray-500">{freq.description}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Date
          </label>
          <input
            type="date"
            value={transaction.startDate}
            onChange={(e) => setTransaction(prev => ({ ...prev, startDate: e.target.value }))}
            className="w-full p-3 border rounded-lg"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>
      <div className="flex justify-between pt-4">
        <button
          onClick={() => setStage(1)}
          className="text-gray-500 hover:text-gray-700 flex items-center"
        >
          <ChevronLeft className="mr-2" /> Back
        </button>
        <button
          onClick={() => setStage(3)}
          disabled={!transaction.amount || !transaction.frequency || !transaction.startDate}
          className={`px-6 py-3 rounded-xl transition-all ${
            transaction.amount && transaction.frequency && transaction.startDate
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-300 text-gray-500"
          }`}
        >
          Next <ChevronRight className="ml-2 inline" />
        </button>
      </div>
    </div>
  );

  const [leaveCash, setLeaveCash] = useState(false);
  
  const calculateTotalAllocation = () => {
    const total = Object.values(transaction.assetAllocations).reduce((sum, value) => sum + (value || 0), 0);
    return leaveCash ? 100 : total;
  };

  const renderAssetAllocation = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Asset Allocation</h2>
      <p className="text-gray-600">Select how your regular deposit should be invested across your portfolio. You can split your investment across multiple assets or leave it as cash.</p>
      
      {/* Asset Search */}
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

      {/* Asset List */}
      <div className="max-h-64 overflow-y-auto space-y-2">
        {filteredAssets.map(asset => (
          <div
            key={asset.code}
            onClick={() => {
              if (leaveCash) return; // Prevent selection if "Leave as Cash" is active
              const isSelected = selectedAssets.some(a => a.code === asset.code);
              setSelectedAssets(
                isSelected 
                  ? selectedAssets.filter(a => a.code !== asset.code)
                  : [...selectedAssets, asset]
              );
              if (!isSelected && !transaction.assetAllocations[asset.code]) {
                setTransaction(prev => ({
                  ...prev,
                  assetAllocations: {
                    ...prev.assetAllocations,
                    [asset.code]: 0
                  }
                }));
              }
            }}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              leaveCash ? 'opacity-50 cursor-not-allowed' :
              selectedAssets.some(a => a.code === asset.code)
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold">{asset.name}</p>
                <p className="text-sm text-gray-500">{asset.code}</p>
                <p className="text-xs text-gray-500">Held: {asset.units} units</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">${asset.currentPrice.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Total: ${asset.totalValue.toLocaleString()}</p>
                {selectedAssets.some(a => a.code === asset.code) && (
                  <div className="mt-2">
                    <input
                      type="number"
                      value={transaction.assetAllocations[asset.code] || ""}
                      onChange={(e) => {
                        const value = Math.min(100, Math.max(0, Number(e.target.value)));
                        setTransaction(prev => ({
                          ...prev,
                          assetAllocations: {
                            ...prev.assetAllocations,
                            [asset.code]: value
                          }
                        }));
                      }}
                      className="w-20 p-2 border rounded-lg text-right"
                      placeholder="0"
                      min="0"
                      max="100"
                      disabled={leaveCash}
                      onClick={e => e.stopPropagation()}
                    />
                    <span className="ml-2">%</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Leave as Cash Button */}
      <button
        onClick={() => {
          setLeaveCash(prev => !prev);
          if (!leaveCash) {
            // Clear all selections when switching to cash
            setSelectedAssets([]);
            setTransaction(prev => ({
              ...prev,
              assetAllocations: {}
            }));
          }
        }}
        className={`w-full p-4 rounded-xl border-2 transition-all ${
          leaveCash
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-200 hover:border-blue-300'
        }`}
      >
        <div className="flex justify-between items-center">
          <span className="font-medium">Leave as Cash</span>
          <span className="text-sm text-gray-500">
            {leaveCash ? "100%" : "0%"}
          </span>
        </div>
      </button>

      {/* Allocation Summary */}
      <div className="bg-gray-50 p-4 rounded-xl space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-gray-200">
          <span className="font-medium">Total Allocation</span>
          <span className={`font-bold ${calculateTotalAllocation() === 100 ? 'text-green-600' : 'text-red-600'}`}>
            {calculateTotalAllocation()}%
          </span>
        </div>
        
        {!leaveCash && selectedAssets.length > 0 && (
          <div className="space-y-2">
            <span className="text-sm font-medium text-gray-700">Selected Assets</span>
            <table className="w-full text-sm">
              <thead className="text-gray-500">
                <tr>
                  <th className="text-left pb-2">Asset</th>
                  <th className="text-right pb-2">Allocation</th>
                </tr>
              </thead>
              <tbody>
                {selectedAssets.map(asset => (
                  <tr key={asset.code}>
                    <td className="py-1">{asset.name}</td>
                    <td className="text-right">{transaction.assetAllocations[asset.code] || 0}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {leaveCash && (
          <div className="text-sm text-gray-600">
            Your regular deposit will be held as cash in your account
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <button
          onClick={() => setStage(2)}
          className="text-gray-500 hover:text-gray-700 flex items-center"
        >
          <ChevronLeft className="mr-2" /> Back
        </button>
        <button
          onClick={() => setStage(4)}
          disabled={!leaveCash && calculateTotalAllocation() !== 100}
          className={`px-6 py-3 rounded-xl transition-all ${
            (leaveCash || calculateTotalAllocation() === 100)
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-300 text-gray-500"
          }`}
        >
          Review <ChevronRight className="ml-2 inline" />
        </button>
      </div>
    </div>
  );


  const renderReview = () => {
    const source = paymentSources.find(s => s.id === transaction.source);
    const frequency = frequencies.find(f => f.id === transaction.frequency);

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">Review Regular Payment</h2>
        <div className="bg-gray-50 p-6 rounded-xl space-y-4">
          <div className="flex justify-between items-center pb-4 border-b">
            <span className="text-gray-600">Amount</span>
            <span className="font-semibold text-lg">${Number(transaction.amount).toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center pb-4 border-b">
            <span className="text-gray-600">Frequency</span>
            <span className="font-medium">{frequency?.label}</span>
          </div>
          <div className="flex justify-between items-center pb-4 border-b">
            <span className="text-gray-600">Start Date</span>
            <span className="font-medium">{new Date(transaction.startDate).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between items-center pb-4 border-b">
            <span className="text-gray-600">From</span>
            <span className="font-medium">{source?.name}</span>
          </div>
          <div className="space-y-2">
            <span className="text-gray-600">Asset Allocation</span>
            {selectedAssets.map(asset => (
              <div key={asset.code} className="flex justify-between items-center">
                <span>{asset.name}</span>
                <span>{transaction.assetAllocations[asset.code]}%</span>
              </div>
            ))}
          </div>
          <div className="pt-4">
            <button
              onClick={onComplete}
              className="w-full py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all"
            >
              Confirm Regular Payment
            </button>
          </div>
        </div>
        <button
          onClick={() => setStage(3)}
          className="text-gray-500 hover:text-gray-700 flex items-center"
        >
          <ChevronLeft className="mr-2" /> Back
        </button>
      </div>
    );
  };

  const renderContent = () => {
    switch (stage) {
      case 1:
        return renderSourceSelection();
      case 2:
        return renderAmountAndFrequency();
      case 3:
        return renderAssetAllocation();
      case 4:
        return renderReview();
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {renderContent()}
    </div>
  );
};

export default RegualarDeposit;