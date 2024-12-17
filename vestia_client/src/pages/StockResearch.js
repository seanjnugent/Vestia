import React, { useState } from "react";

const Research = () => {
  // Fake data for assets
  const fakeAssets = [
    {
      ticker: "AAPL",
      name: "Apple Inc.",
      marketPrice: 174.56,
      change: 1.34,
      percentChange: 0.77,
      sector: "Technology",
      marketCap: "2.89T",
      fiftyTwoWeekHigh: 198.23,
      fiftyTwoWeekLow: 123.47,
    },
    {
      ticker: "TSLA",
      name: "Tesla Inc.",
      marketPrice: 254.87,
      change: -3.21,
      percentChange: -1.24,
      sector: "Consumer Discretionary",
      marketCap: "0.81T",
      fiftyTwoWeekHigh: 299.23,
      fiftyTwoWeekLow: 191.54,
    },
  ];

  const [search, setSearch] = useState("");
  const [selectedAsset, setSelectedAsset] = useState(null);

  // Filter assets based on search input
  const filteredAssets = fakeAssets.filter((asset) =>
    asset.ticker.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold mb-4">Asset Market Research</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by ticker (e.g., AAPL)"
        className="w-full p-3 border border-gray-300 rounded-lg mb-6"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Asset List */}
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="bg-gray-100 text-gray-700 font-medium">
            <th className="py-3 px-4">Ticker</th>
            <th className="py-3 px-4">Name</th>
            <th className="py-3 px-4">Price</th>
            <th className="py-3 px-4">Change</th>
            <th className="py-3 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAssets.map((asset) => (
            <tr
              key={asset.ticker}
              className="hover:bg-gray-50 transition cursor-pointer"
              onClick={() => setSelectedAsset(asset)}
            >
              <td className="py-3 px-4">{asset.ticker}</td>
              <td className="py-3 px-4">{asset.name}</td>
              <td className="py-3 px-4">${asset.marketPrice.toFixed(2)}</td>
              <td
                className={`py-3 px-4 ${
                  asset.change >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {asset.change.toFixed(2)} ({asset.percentChange.toFixed(2)}%)
              </td>
              <td className="py-3 px-4">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                  Trade this asset
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Asset Details Modal */}
      {selectedAsset && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              {selectedAsset.name} ({selectedAsset.ticker})
            </h2>
            <p className="mb-2">
              <strong>Sector:</strong> {selectedAsset.sector}
            </p>
            <p className="mb-2">
              <strong>Market Cap:</strong> {selectedAsset.marketCap}
            </p>
            <p className="mb-2">
              <strong>52-Week High:</strong> ${selectedAsset.fiftyTwoWeekHigh}
            </p>
            <p className="mb-4">
              <strong>52-Week Low:</strong> ${selectedAsset.fiftyTwoWeekLow}
            </p>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full"
              onClick={() => alert("Trade functionality coming soon!")}
            >
              Trade this asset
            </button>
            <button
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg w-full mt-2"
              onClick={() => setSelectedAsset(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Research;
