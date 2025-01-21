import React from 'react';

const DepositReview = ({ amount, selectedAssets }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Review Your Deposit</h2>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-700">Basic Details</h3>
          <div className="space-y-2">
            <p><span className="font-medium">Amount:</span> ${amount}</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-700">Selected Assets</h3>
          {selectedAssets.length > 0 ? (
            <div className="space-y-2">
              {selectedAssets.map((asset) => (
                <div key={asset.asset_id} className="p-4 rounded-xl border-2 border-gray-200">
                  <p><span className="font-medium">Asset:</span> {asset.asset_name}</p>
                  <p><span className="font-medium">Allocation:</span> ${asset.allocation_amount}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No assets selected. The entire amount will be allocated to cash.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepositReview;
