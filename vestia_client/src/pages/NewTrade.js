import React, { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, CheckCircle2, ArrowLeftRight, Coins, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AnimatedSpinner = () => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
  >
    <RefreshCw className="text-blue-500 w-8 h-8" />
  </motion.div>
);

const NewTrade = () => {

  const heldAssets = [
    { code: "AAPL", name: "Apple Inc.", units: 10, value: 1450 },
    { code: "MSFT", name: "Microsoft", units: 15, value: 3000 },
  ];

  const availableAssets = [
    { code: "TSLA", name: "Tesla", unitPrice: 850 },
    { code: "GOOGL", name: "Alphabet", unitPrice: 2800 },
    { code: "AMZN", name: "Amazon", unitPrice: 3200 },
    { code: "META", name: "Meta Platforms", unitPrice: 300 },
  ];

  const navigate = useNavigate();
  const [stage, setStage] = useState(0);
  const [account, setAccount] = useState("");
  const [tradeType, setTradeType] = useState("buy");
  const [buyInput, setBuyInput] = useState({ search: "", selectedAssets: [] });
  const [sellInputs, setSellInputs] = useState({});
  const [selectedSellAsset, setSelectedSellAsset] = useState(null);
  const [unitsAmount, setUnitsAmount] = useState({});

  const handleNextStage = () => {
    if (stage === 1 && tradeType === "buy" && !buyInput.selectedAssets.length) return; // Require asset for buy
    if (stage === 1 && tradeType === "sell" && !selectedSellAsset) return; // Require asset for sell
    setStage((prev) => prev + 1);
  };

  const handleAssetSelection = (asset) => {
    if (tradeType === "buy") {
      setBuyInput((prev) => ({ ...prev, selectedAssets: [...prev.selectedAssets, asset] }));
    } else {
      setSelectedSellAsset(asset);
    }
  };

  const filteredAssets = useMemo(() => {
    const search = buyInput.search.toLowerCase();
    if (tradeType === "buy") {
      return availableAssets.filter((asset) =>
        asset.name.toLowerCase().includes(search) || asset.code.toLowerCase().includes(search)
      );
    }
    return heldAssets.filter((asset) =>
      asset.name.toLowerCase().includes(search) || asset.code.toLowerCase().includes(search)
    );
  }, [buyInput.search, tradeType]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-blue-100 p-6"
      >
        <h1 className="text-3xl font-bold text-center text-blue-800 mb-6">New Trade</h1>
        {stage === 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Account</label>
            <select
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              className="w-full px-4 py-2.5 border rounded-lg"
            >
              <option value="" disabled>Choose an account</option>
              <option value="investment">Investment Account</option>
              <option value="savings">Savings Account</option>
            </select>
            <button
              disabled={!account}
              onClick={() => setStage(1)}
              className={`w-full mt-4 py-3 rounded-lg ${
                account ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-500"
              }`}
            >
              Next
            </button>
          </div>
        )}

        {stage === 1 && (
          <div>
            <div className="flex justify-between mb-4">
              <button
                onClick={() => setTradeType("buy")}
                className={`w-1/2 py-2.5 rounded-lg transition-colors ${
                  tradeType === "buy" ? "bg-blue-500 text-white" : "bg-gray-100"
                  }`}
              >
                Buy
              </button>
              <button
                onClick={() => setTradeType("sell")}
                className={`w-1/2 py-2.5 rounded-lg transition-colors ${
                  tradeType === "sell" ? "bg-blue-500 text-white" : "bg-gray-100"
                }`}
              >
                Sell
              </button>
            </div>

            <input
              type="text"
              placeholder="Search assets..."
              value={buyInput.search}
              onChange={(e) =>
                setBuyInput((prev) => ({ ...prev, search: e.target.value }))
              }
              className="w-full px-4 py-2.5 border rounded-lg"
            />

            <div className="mt-4 space-y-2">
              {filteredAssets.map((asset) => (
                <div
                  key={asset.code}
                  onClick={() => handleAssetSelection(asset)}
                  className={`p-4 rounded-lg border cursor-pointer ${
                    buyInput.selectedAssets.includes(asset) ? "bg-blue-100 border-blue-500" : "border-gray-200"
                  }`}
                >
                  <p className="font-medium">{asset.name}</p>
                  <p className="text-sm text-gray-500">{asset.code}</p>
                </div>
              ))}
            </div>

            <button
              onClick={handleNextStage}
              className="w-full mt-4 py-3 bg-blue-500 text-white rounded-lg"
            >
              Next
            </button>
          </div>
        )}

        {stage === 2 && (
          <div>
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr>
                  <th className="bg-gray-100">Asset</th>
                  <th className="bg-gray-100">Units/Amount</th>
                  <th className="bg-gray-100">Amount/Units</th>
                </tr>
              </thead>
              <tbody>
                {buyInput.selectedAssets.map((asset) => (
                  <tr key={asset.code}>
                    <td className="border">{asset.name}</td>
                    <td className="border">
                      <input
                        type="number"
                        value={unitsAmount[asset.code]}
                        onChange={(e) =>
                          setUnitsAmount((prev) => ({ ...prev, [asset.code]: e.target.value }))
                        }
                        className="w-full px-4 py-2.5 border rounded-lg"
                      />
                    </td>
                    <td className="border">
                      <input
                        type="number"
                        value={unitsAmount[asset.code] * asset.unitPrice}
                        className="w-full px-4 py-2.5 border rounded-lg"
                        readOnly
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {tradeType === "sell" && (
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr>
                    <th className="bg-gray-100">Asset</th>
                    <th className="bg-gray-100">Units/Amount</th>
                    <th className="bg-gray-100">Amount/Units</th>
                  </tr>
                </thead>
                <tbody>
                  {sellInputs.map((input) => (
                    <tr key={input.code}>
                      <td className="border">{input.name}</td>
                      <td className="border">
                        <input
                          type="number"
                          value={input.value}
                          onChange={(e) =>
                            setSellInputs((prev) => ({ ...prev, [input.code]: e.target.value }))
                          }
                          className="w-full px-4 py-2.5 border rounded-lg"
                        />
                      </td>
                      <td className="border">
                        <input
                          type="number"
                          value={input.value * input.unitPrice}
                          className="w-full px-4 py-2.5 border rounded-lg"
                          readOnly
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <button
              onClick={() => navigate("/home")}
              className="w-full mt-4 py-3 bg-green-500 text-white rounded-lg"
            >
              Confirm Trade
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default NewTrade;