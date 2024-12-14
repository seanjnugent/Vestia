import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, CheckCircle2 } from "lucide-react";

const NewTrade = () => {
  const navigate = useNavigate();
  const [stage, setStage] = useState(0);
  const [account, setAccount] = useState("");
  const [tradeType, setTradeType] = useState("buy");
  const [heldAssets] = useState([
    { code: "AAPL", name: "Apple Inc.", units: 10, value: 1450 },
    { code: "MSFT", name: "Microsoft", units: 15, value: 3000 },
  ]);
  const [availableAssets] = useState([
    { code: "TSLA", name: "Tesla", unitPrice: 850 },
    { code: "GOOGL", name: "Alphabet", unitPrice: 2800 },
    { code: "AMZN", name: "Amazon", unitPrice: 3200 },
    { code: "META", name: "Meta Platforms", unitPrice: 300 }
  ]);
  const [sellInputs, setSellInputs] = useState({});
  const [buyInput, setBuyInput] = useState({ 
    search: "", 
    selectedAsset: null,
    units: 0,
    totalValue: "0.00"
  });

  const handleAccountSelect = (value) => {
    setAccount(value);
    setStage(1);
  };

  const handleSellInput = (code, key, value) => {
    setSellInputs((prev) => {
      const updatedInputs = {
        ...prev,
        [code]: { ...prev[code], [key]: value }
      };
      return updatedInputs;
    });
    setStage(2);
  };

  const totalSellValue = Object.values(sellInputs).reduce(
    (acc, curr) => acc + (curr?.value || 0),
    0
  );

  const filteredAvailableAssets = useMemo(() => {
    return availableAssets.filter(asset => 
      asset.name.toLowerCase().includes(buyInput.search.toLowerCase()) ||
      asset.code.toLowerCase().includes(buyInput.search.toLowerCase())
    );
  }, [availableAssets, buyInput.search]);

  const handleAssetSelect = (asset) => {
    setBuyInput(prev => ({
      ...prev,
      selectedAsset: asset,
      search: `${asset.code} - ${asset.name}`,
      units: 0,
      totalValue: "0.00"
    }));
    setStage(2);
  };

  const handleBuyUnitsChange = (e) => {
    const units = e.target.value === '' ? 0 : parseFloat(e.target.value);
    const totalValue = units * (buyInput.selectedAsset?.unitPrice || 0);
    
    setBuyInput(prev => ({
      ...prev,
      units: units,
      totalValue: totalValue.toFixed(2)
    }));
  };

  const handleSubmitTrade = () => {
    const tradeDetails = tradeType === 'buy' 
      ? {
          asset: buyInput.selectedAsset,
          units: buyInput.units,
          totalValue: buyInput.totalValue
        }
      : Object.entries(sellInputs).map(([code, details]) => ({
          code,
          percent: details.percent,
          value: details.value
        }));

    console.log("Trade Submitted", { 
      account, 
      tradeType, 
      details: tradeDetails 
    });
    
    navigate('/home');
  };

  const isSubmitEnabled = () => {
    if (tradeType === 'buy') {
      return buyInput.selectedAsset && buyInput.units > 0;
    }
    return Object.keys(sellInputs).length > 0;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          New Trade
        </h1>

        {/* Account Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Account
          </label>
          <select
            value={account}
            onChange={(e) => handleAccountSelect(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>Choose an account</option>
            <option value="investment">Investment Account</option>
            <option value="savings">Savings Account</option>
          </select>
        </div>

        {stage >= 1 && (
          <>
            {/* Trade Type Toggle */}
            <div className="flex border border-gray-200 rounded-lg mb-6">
              <button
                onClick={() => setTradeType("buy")}
                className={`w-1/2 py-2.5 rounded-lg transition-colors ${
                  tradeType === "buy" 
                    ? "bg-blue-500 text-white" 
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Buy
              </button>
              <button
                onClick={() => setTradeType("sell")}
                className={`w-1/2 py-2.5 rounded-lg transition-colors ${
                  tradeType === "sell" 
                    ? "bg-blue-500 text-white" 
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Sell
              </button>
            </div>

            {/* Buy Section */}
            {tradeType === "buy" && (
              <div>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search assets..."
                    value={buyInput.search}
                    onChange={(e) => 
                      setBuyInput(prev => ({ ...prev, search: e.target.value }))
                    }
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="max-h-48 overflow-y-auto border rounded-lg">
                  {filteredAvailableAssets.map((asset) => (
                    <div 
                      key={asset.code} 
                      onClick={() => handleAssetSelect(asset)}
                      className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex justify-between items-center border-b last:border-b-0"
                    >
                      <div>
                        <div className="font-semibold">{asset.code}</div>
                        <div className="text-sm text-gray-500">{asset.name}</div>
                      </div>
                      <div className="text-right">
                        <div>£{asset.unitPrice.toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {buyInput.selectedAsset && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Units
                    </label>
                    <input
                      type="number"
                      value={buyInput.units}
                      onChange={handleBuyUnitsChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter number of units"
                    />
                    <div className="mt-2 text-sm text-gray-600">
                      Total Value: £{buyInput.totalValue}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Sell Section */}
            {tradeType === "sell" && (
              <div>
                <div className="space-y-4">
                  {heldAssets.map((asset) => (
                    <div 
                      key={asset.code} 
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between mb-2">
                        <div>
                          <div className="font-semibold">{asset.code}</div>
                          <div className="text-sm text-gray-500">{asset.name}</div>
                        </div>
                        <div className="text-right">
                          <div>Units: {asset.units}</div>
                          <div>Value: £{asset.value.toFixed(2)}</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          placeholder="Sell %"
                          max="100"
                          value={sellInputs[asset.code]?.percent || ""}
                          onChange={(e) => 
                            handleSellInput(
                              asset.code, 
                              "percent", 
                              parseFloat(e.target.value)
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="number"
                          placeholder="Value £"
                          max={asset.value}
                          value={sellInputs[asset.code]?.value || ""}
                          onChange={(e) => 
                            handleSellInput(
                              asset.code, 
                              "value", 
                              parseFloat(e.target.value)
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmitTrade}
              disabled={!isSubmitEnabled()}
              className={`w-full mt-6 py-3 rounded-lg text-white transition-colors ${
                isSubmitEnabled()
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Confirm Trade
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default NewTrade;