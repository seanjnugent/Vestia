import React from "react";
import PropTypes from "prop-types";

const TradeReview = ({
  account,
  tradeType,
  tradeData,
  onConfirm,
  onBack,
  tradeMode,
}) => {
  const { selectedAssets, inputType } = tradeData;

  const calculateTotalValue = () => {
    return selectedAssets.reduce((total, asset) => {
      const quantity = asset.allocation?.[inputType] || 0;
      const value = quantity * asset.latest_price;
      return total + value;
    }, 0);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Trade Summary</h3>
            <p className="text-sm text-gray-500">
              Review your {tradeType.toLowerCase()} order
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              tradeType === "Buy" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {tradeType}
          </span>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between py-3 border-b border-gray-100">
            <span className="text-gray-600">Account</span>
            <span className="font-medium text-gray-900">{account.account_name}</span>
          </div>

          <div className="space-y-3">
            {selectedAssets.map((asset) => {
              const quantity = asset.allocation?.[inputType] || 0;
              const value = quantity * asset.latest_price;

              return (
                <div
                  key={asset.asset_id}
                  className="flex justify-between items-center py-2"
                >
                  <div>
                    <p className="font-medium text-gray-900">{asset.asset_name}</p>
                    <p className="text-sm text-gray-500">
                      {tradeMode === "VALUE"
                        ? `£${value.toLocaleString("en-GB")}`
                        : `${quantity} units`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      £{asset.latest_price.toLocaleString("en-GB")}
                    </p>
                    <p className="text-sm text-gray-500">Current Price</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between py-3 border-t border-gray-100">
            <span className="font-medium text-gray-900">Total Value</span>
            <span className="font-semibold text-gray-900">
              £{calculateTotalValue().toLocaleString("en-GB")}
            </span>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={onBack}
            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-3 rounded-xl text-white transition-colors ${
              tradeType === "Buy"
                ? "bg-green-500 hover:bg-green-600"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            Confirm {tradeType}
          </button>
        </div>
      </div>
    </div>
  );
};

TradeReview.propTypes = {
  account: PropTypes.object.isRequired,
  tradeType: PropTypes.oneOf(["Buy", "Sell"]).isRequired,
  tradeData: PropTypes.shape({
    selectedAssets: PropTypes.array.isRequired,
    inputType: PropTypes.string.isRequired,
  }).isRequired,
  onConfirm: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  tradeMode: PropTypes.oneOf(["VALUE", "UNITS"]).isRequired,
};

export default TradeReview;