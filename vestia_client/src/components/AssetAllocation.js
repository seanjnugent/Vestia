import React from "react";

const AssetAllocation = ({ selectedAssets, setSelectedAssets, amount }) => {
  const handleAllocationChange = (assetId, value) => {
    setSelectedAssets(
      selectedAssets.map(asset =>
        asset.asset_id === assetId ? { ...asset, allocation_amount: value } : asset
      )
    );
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Allocation</h2>
      <p className="text-sm text-gray-500">Allocate your investment across the selected assets and cash.</p>
      <div className="space-y-2">
        {selectedAssets.map(asset => (
          <div key={asset.asset_id} className="p-4 rounded-xl border-2 border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold">{asset.asset_name}</p>
                <p className="text-sm text-gray-500">{asset.asset_code}</p>
              </div>
              <input
                type="number"
                value={asset.allocation_amount || ''}
                onChange={(e) => handleAllocationChange(asset.asset_id, e.target.value)}
                className="w-24 px-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                placeholder="Amount"
              />
            </div>
          </div>
        ))}
        <div className="p-4 rounded-xl border-2 border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold">Cash</p>
              <p className="text-sm text-gray-500">Remaining amount will be allocated to cash.</p>
            </div>
            <input
              type="number"
              value={amount - selectedAssets.reduce((sum, asset) => sum + (parseInt(asset.allocation_amount) || 0), 0)}
              disabled
              className="w-24 px-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetAllocation;
