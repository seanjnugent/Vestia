import React from "react";

const Funds = () => {
  const topPerformers = [
    { name: "Apple", symbol: "AAPL", change: "+2.5%", price: "$180.50" },
    { name: "Tesla", symbol: "TSLA", change: "+1.8%", price: "$240.20" },
    { name: "Microsoft", symbol: "MSFT", change: "+3.0%", price: "$315.40" },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Top Funds</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {topPerformers.map((stock, index) => (
          <div
            key={index}
            className="p-4 bg-white shadow-md rounded-md hover:shadow-lg"
          >
            <h2 className="text-lg font-bold text-gray-800">{stock.name}</h2>
            <p className="text-gray-600">{stock.symbol}</p>
            <p className="text-green-500">{stock.change}</p>
            <p className="text-gray-800 font-bold">{stock.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Funds;
