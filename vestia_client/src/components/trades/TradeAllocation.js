import React from "react";
import PropTypes from "prop-types";

const TradeAllocation = ({
  selectedAssets,
  setSelectedAssets,
  amount,
  inputType,
  setInputType,
  onNext,
  tradeMode,
}) => {
  const handleAllocationChange = (assetId, value) => {
    setSelectedAssets(
      selectedAssets.map((asset) =>
        asset.asset_id === assetId
          ? { ...asset, allocation: { ...asset.allocation, [inputType]: value } }
          : asset
      )
    );
  };

  const toggleInputType = () => {
    const newInputType = inputType === "amount" ? "units" : "amount";
    setSelectedAssets(
      selectedAssets.map((asset) => ({
        ...asset,
        allocation: {
          ...asset.allocation,
          [newInputType]: asset.allocation[inputType],
        },
      }))
    );
    setInputType(newInputType);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Allocation</h2>
      <p className="text-sm text-gray-500">
        Allocate your investment across the selected assets.
      </p>
      <div className="flex justify-end mb-4">
        <button
          onClick={toggleInputType}
          className="px-4 py-2 text-sm font-medium text-gray-800 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-2 focus:ring-indigo-500"
        >
          Switch to {inputType === "amount" ? "Units" : "Amount"}
        </button>
      </div>
      <div className="space-y-2">
        {selectedAssets.length > 0 ? (
          selectedAssets.map((asset) => (
            <div
              key={asset.asset_id}
              className="p-4 rounded-xl border-2 border-gray-200"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold">{asset.asset_name}</p>
                  <p className="text-sm text-gray-500">{asset.asset_code}</p>
                </div>
                <input
                  type="number"
                  value={asset.allocation?.[inputType] || ""}
                  onChange={(e) =>
                    handleAllocationChange(asset.asset_id, e.target.value)
                  }
                  className="w-24 px-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  placeholder={inputType === "amount" ? "Amount" : "Units"}
                />
              </div>
            </div>
          ))
        ) : (
          <p>No assets selected.</p>
        )}
      </div>
      <div className="flex justify-end">
        <button
          onClick={onNext}
          className="px-6 py-3 text-white bg-indigo-600 rounded-lg shadow hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500"
        >
          Next
        </button>
      </div>
    </div>
  );
};

TradeAllocation.propTypes = {
  selectedAssets: PropTypes.array.isRequired,
  setSelectedAssets: PropTypes.func.isRequired,
  amount: PropTypes.number.isRequired,
  inputType: PropTypes.string.isRequired,
  setInputType: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  tradeMode: PropTypes.oneOf(["VALUE", "UNITS"]).isRequired,
};

export default TradeAllocation;