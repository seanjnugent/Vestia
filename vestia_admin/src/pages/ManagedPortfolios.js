import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { Link } from "react-router-dom";

const ManagedPortfolios = () => {
  const [portfolios, setPortfolios] = useState([
    { name: "Adventurous", allocations: [{ fund: "Fund A", percentage: 50 }, { fund: "Fund B", percentage: 50 }] },
    { name: "Cautious", allocations: [{ fund: "Fund C", percentage: 70 }, { fund: "Fund D", percentage: 30 }] },
  ]);

  const [newPortfolio, setNewPortfolio] = useState({ name: "", allocations: [] });
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const handleCreatePortfolio = () => {
    setPortfolios([...portfolios, newPortfolio]);
    setNewPortfolio({ name: "", allocations: [] });
  };

  const handleEditPortfolio = (index, updatedPortfolio) => {
    const updatedPortfolios = [...portfolios];
    updatedPortfolios[index] = updatedPortfolio;
    setPortfolios(updatedPortfolios);
  };

  const renderPieChart = (allocations) => (
    <PieChart width={200} height={200}>
      <Pie
        data={allocations}
        dataKey="percentage"
        nameKey="fund"
        cx="50%"
        cy="50%"
        outerRadius={80}
        fill="#8884d8"
      >
        {allocations.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Managed Portfolios</h1>
        <Link to="/dashboard" className="text-blue-500 hover:underline">Go to Dashboard</Link>
      </div>

      {/* Create Portfolio */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Create New Portfolio</h2>
        <input
          type="text"
          placeholder="Portfolio Name"
          value={newPortfolio.name}
          onChange={(e) => setNewPortfolio({ ...newPortfolio, name: e.target.value })}
          className="w-full px-4 py-2 mb-4 border rounded-lg"
        />
        <button
          onClick={handleCreatePortfolio}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Create Portfolio
        </button>
      </div>

      {/* Existing Portfolios */}
      <div className="grid grid-cols-2 gap-6">
        {portfolios.map((portfolio, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">{portfolio.name}</h3>
              <button
                onClick={() => setSelectedPortfolio(index)}
                className="text-blue-500 hover:underline"
              >
                Edit
              </button>
            </div>
            {renderPieChart(portfolio.allocations)}
            <div className="mt-4">
              <h4 className="font-bold text-gray-700">Allocations:</h4>
              <ul className="mt-2 text-gray-600">
                {portfolio.allocations.map((allocation, i) => (
                  <li key={i}>{allocation.fund}: {allocation.percentage}%</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Portfolio for Editing */}
      {selectedPortfolio !== null && (
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Portfolio</h2>
          <input
            type="text"
            placeholder="Portfolio Name"
            value={portfolios[selectedPortfolio].name}
            onChange={(e) =>
              handleEditPortfolio(selectedPortfolio, {
                ...portfolios[selectedPortfolio],
                name: e.target.value,
              })
            }
            className="w-full px-4 py-2 mb-4 border rounded-lg"
          />
          {/* Additional allocation editing UI can be added here */}
          <button
            onClick={() => setSelectedPortfolio(null)}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default ManagedPortfolios;
