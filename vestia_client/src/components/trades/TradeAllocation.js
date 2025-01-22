
import React, { useState } from 'react';
import PropTypes from "prop-types";

const TradeAllocation = ({ selectedAssets, setSelectedAssets, amount, inputType, setInputType, onNext, tradeMode }) => {
// In TradeAllocation.js
const handleAllocationChange = (assetId, value) => {
  const numericValue = parseFloat(value) || 0;
  const updatedAssets = selectedAssets.map(asset => {
    if (asset.asset_id === assetId) {
      const allocation = {
        allocation_amount: numericValue,
        allocation_type: inputType, // Store the type of allocation
        estimated_units: inputType === 'amount' ? numericValue / asset.latest_price : numericValue,
        estimated_value: inputType === 'amount' ? numericValue : numericValue * asset.latest_price
      };

      // Ensure the user cannot sell more than they hold
      if (tradeMode === 'sell' && allocation.estimated_units > asset.asset_holding) {
        alert(`You cannot sell more than ${asset.asset_holding} units of ${asset.asset_name}`);
        return asset;
      }

      return {
        ...asset,
        allocation
      };
    }
    return asset;
  });
  setSelectedAssets(updatedAssets);
};

  const handleInputTypeChange = (type) => {
    setInputType(type);
    // Reset allocations when switching between amount/units
    const updatedAssets = selectedAssets.map(asset => {
      if (asset.allocation) {
        return {
          ...asset,
          allocation: {
            ...asset.allocation,
            allocation_type: type,
            allocation_amount: 0 // Reset allocation amount when switching input type
          }
        };
      }
      return asset;
    });
    setSelectedAssets(updatedAssets);
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-4 mb-4">
        <button
          className={`px-4 py-2 rounded ${inputType === 'amount' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => handleInputTypeChange('amount')}
        >
          Amount
        </button>
        <button
          className={`px-4 py-2 rounded ${inputType === 'units' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => handleInputTypeChange('units')}
        >
          Units
        </button>
      </div>

      {selectedAssets.map(asset => (
        <div key={asset.asset_id} className="p-4 rounded-xl border-2 border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold">{asset.asset_name}</p>
              <p className="text-sm text-gray-500">{asset.asset_code}</p>
              <p className="text-sm text-gray-500">Price: £{asset.latest_price}</p>
            </div>
            <div className="space-y-1">
              <input
                type="number"
                value={asset.allocation?.allocation_amount || ''}
                onChange={(e) => handleAllocationChange(asset.asset_id, e.target.value)}
                className="w-32 px-3 py-2 border rounded"
                placeholder={inputType === 'amount' ? 'Amount' : 'Units'}
              />
              <p className="text-xs text-gray-500 text-right">
                {inputType === 'amount'
                  ? `≈ ${((asset.allocation?.estimated_units || 0)).toFixed(2)} units`
                  : `≈ £${((asset.allocation?.estimated_value || 0)).toFixed(2)}`}
              </p>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={onNext}
        className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Continue
      </button>
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