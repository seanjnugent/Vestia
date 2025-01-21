import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { BeatLoader } from "react-spinners";
import PropTypes from "prop-types";

const TradeSelection = ({
  selectedAssets,
  setSelectedAssets,
  tradeType,
  onContinue, // Ensure this prop is passed
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/assets/getAssets/assets`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch assets: ${response.statusText}`);
        }

        const data = await response.json();
        setAssets(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, []);

  const filteredAssets = assets.filter(
    (asset) =>
      asset.asset_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.asset_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAssetSelection = (asset) => {
    const isSelected = selectedAssets.some((a) => a.asset_id === asset.asset_id);
    setSelectedAssets(
      isSelected
        ? selectedAssets.filter((a) => a.asset_id !== asset.asset_id)
        : [...selectedAssets, { ...asset, allocation: { amount: 0, units: 0 } }]
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <BeatLoader color="#38d6b7" size={15} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center">
        Error: {error}. Please try again later.
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <div className="text-gray-700 text-center">
        No assets available at the moment.
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
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
        {filteredAssets.map((asset) => (
          <div
            key={asset.asset_id}
            onClick={() => handleAssetSelection(asset)}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex justify-between items-center ${
              selectedAssets.some((a) => a.asset_id === asset.asset_id)
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-300"
            }`}
          >
            <div>
              <p className="font-bold">{asset.asset_name}</p>
              <p className="text-sm text-gray-500">{asset.asset_code}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">
                ${parseFloat(asset.latest_price).toLocaleString()}
              </p>
              <p
                className={`text-sm ${
                  asset.asset_status === "Active"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {asset.asset_status}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* "Next" button */}
      <motion.button
        onClick={onContinue} // Ensure this calls the onContinue function
        disabled={selectedAssets.length === 0}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full py-3 rounded-xl transition-all ${
          selectedAssets.length > 0
            ? "bg-blue-500 text-white hover:bg-blue-600"
            : "bg-gray-300 text-gray-500"
        }`}
      >
        Next
      </motion.button>
    </motion.div>
  );
};

TradeSelection.propTypes = {
  selectedAssets: PropTypes.array.isRequired,
  setSelectedAssets: PropTypes.func.isRequired,
  tradeType: PropTypes.oneOf(["buy", "sell"]).isRequired,
  onContinue: PropTypes.func.isRequired, // Ensure this prop is required
};

export default TradeSelection;