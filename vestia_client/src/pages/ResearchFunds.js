import React, { useState } from "react";

const Funds = () => {
  const [showFilters, setShowFilters] = useState(false);
  const topPerformers = [
    { name: "Apple", symbol: "AAPL", change: "+2.5%", price: "$180.50" },
    { name: "Tesla", symbol: "TSLA", change: "+1.8%", price: "$240.20" },
    { name: "Microsoft", symbol: "MSFT", change: "+3.0%", price: "$315.40" },
  ];

  const filterOptions = ["All Stocks", "Tech", "Healthcare", "Finance", "Energy"];

  return (
    <div className="p-6 bg-gray-50 min-h-screen relative">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Top Funds</h1>
      <div className="mb-4 relative">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
          onClick={() => setShowFilters(!showFilters)}
        >
          All Stocks
        </button>
        {showFilters && (
          <div className="absolute mt-2 w-48 bg-white shadow-lg rounded-md z-10">
            {filterOptions.map((option, index) => (
              <div
                key={index}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  // Handle filter option click
                  console.log(`Selected filter: ${option}`);
                  setShowFilters(false);
                }}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {topPerformers.map((stock, index) => (
          <div
            key={index}
            className="p-4 bg-white shadow-md rounded-md hover:shadow-lg"
          >
            <h2 className="text-lg font-bold text-gray-800">{stock.name}</h2>
            <p className="text-gray-600">{stock.symbol}</p>
            <p className="text-green-600">{stock.change}</p>
            <p className="text-gray-800">{stock.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Funds;