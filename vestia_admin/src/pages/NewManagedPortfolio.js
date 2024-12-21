import React, { useState } from 'react';
import { Search, ChevronRight } from 'lucide-react';
import { Pie } from 'react-chartjs-2';
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

const NewManagedPortfolio = () => {
  const [portfolioName, setPortfolioName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [allocations, setAllocations] = useState({ CASH: 100 });

  const availableAssets = [
    { code: "VTI", name: "Vanguard Total Stock Market ETF", currentPrice: 240.50, changePercent: "+1.2%" },
    { code: "BND", name: "Vanguard Total Bond Market ETF", currentPrice: 72.30, changePercent: "-0.3%" },
    { code: "VNQ", name: "Vanguard Real Estate ETF", currentPrice: 84.15, changePercent: "+0.8%" },
    { code: "VXUS", name: "Vanguard Total International Stock ETF", currentPrice: 56.78, changePercent: "+0.5%" },
  ];

  const filteredAssets = availableAssets.filter(asset =>
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAllocation = Object.values(allocations).reduce((sum, value) => sum + (value || 0), 0);

  const handleAssetSelect = (asset) => {
    const isSelected = selectedAssets.some(a => a.code === asset.code);
    if (isSelected) {
      setSelectedAssets(selectedAssets.filter(a => a.code !== asset.code));
      const newAllocations = { ...allocations };
      delete newAllocations[asset.code];
      setAllocations(newAllocations);
    } else {
      setSelectedAssets([...selectedAssets, asset]);
      setAllocations({ ...allocations, [asset.code]: 0 });
    }
  };

  const handleAllocationChange = (assetCode, value) => {
    setAllocations({ ...allocations, [assetCode]: value });
  };

  const chartData = {
    labels: ['Cash', ...selectedAssets.map(asset => asset.code)],
    datasets: [{
      data: [allocations.CASH || 0, ...selectedAssets.map(asset => allocations[asset.code] || 0)],
      backgroundColor: ['#2ecc71', '#3498db', '#e74c3c', '#f1c40f', '#9b59b6', '#1abc9c'],
    }],
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: 'right',
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="max-w-4xl mx-auto px-6 pb-16 space-y-8">
      <div className="bg-white rounded-lg shadow-md px-8 py-6">
        <h2 className="text-2xl font-bold mb-6">Create New Managed Portfolio</h2>

        {/* Step 1: Portfolio Name */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">1. Name your portfolio</h3>
          <input
            type="text"
            placeholder="Portfolio Name"
            value={portfolioName}
            onChange={(e) => setPortfolioName(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Step 2: Select Assets */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">2. Select assets</h3>
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search available assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
          </div>

          <div className="max-h-64 overflow-y-auto rounded-lg border">
            {filteredAssets.map(asset => (
              <div
                key={asset.code}
                onClick={() => handleAssetSelect(asset)}
      
      onClick={() => handleAssetSelect(asset)}
      className={`p-4 border-b last:border-b-0 cursor-pointer transition-all flex justify-between items-center hover:bg-gray-50 ${
        selectedAssets.some(a => a.code === asset.code)
          ? 'bg-blue-50 border-l-4 border-blue-500'
          : ''
      }`}
    >
      <div>
        <p className="font-medium text-gray-800">{asset.name}</p>
        <p className="text-sm text-gray-500">{asset.code}</p>
      </div>
      <div className="text-right">
        <p className="font-medium text-gray-800">${asset.currentPrice.toLocaleString()}</p>
        <p className={`text-sm ${asset.changePercent.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
          {asset.changePercent}
        </p>
      </div>
    </div>
  ))}
</div>

{/* Step 3: Select Allocations */}
<div className="mb-8">
  <h3 className="text-lg font-semibold mb-4">3. Select asset allocations</h3>
  <div className="mt-6 space-y-6">
    {/* Cash allocation slider */}
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="font-medium text-gray-800">Cash</span>
        <span className="text-sm text-gray-600">{allocations.CASH || 0}%</span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={allocations.CASH || 0}
        onChange={(e) => handleAllocationChange('CASH', parseInt(e.target.value))}
        className="w-full appearance-none h-2 bg-gray-200 rounded-lg outline-none cursor-pointer"
      />
    </div>

    {/* Other asset allocation sliders */}
    {selectedAssets.map(asset => (
      <div key={asset.code} className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-800">{asset.code}</span>
          <span className="text-sm text-gray-600">{allocations[asset.code] || 0}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={allocations[asset.code] || 0}
          onChange={(e) => handleAllocationChange(asset.code, parseInt(e.target.value))}
          className="w-full appearance-none h-2 bg-gray-200 rounded-lg outline-none cursor-pointer"
        />
      </div>
    ))}

    {totalAllocation !== 100 && (
      <div className={`text-sm ${totalAllocation > 100 ? 'text-red-500' : 'text-yellow-500'}`}>
        Total allocation: {totalAllocation}% (Must equal 100%)
      </div>
    )}
  </div>
</div>

{/* Step 4: Review */}
<div className="mb-8">
  <h3 className="text-lg font-semibold mb-4">4. Review your portfolio</h3>
  <div className="mt-8 relative h-72">
    <Pie data={chartData} options={chartOptions} />
  </div>
</div>

{/* Summary */}
<div className="mb-8">
  <h4 className="font-medium text-lg mb-2 text-gray-800">Portfolio Summary</h4>
  <ul className="space-y-1 text-gray-700">
    <li><strong>Portfolio Name:</strong> {portfolioName}</li>
    <li><strong>Cash Allocation:</strong> {allocations.CASH}%</li>
    {selectedAssets.map(asset => (
      <li key={asset.code}><strong>{asset.name}:</strong> {allocations[asset.code]}%</li>
    ))}
  </ul>
</div>

{/* Step 5: Confirm */}
<div className="mt-6">
  <button
    disabled={totalAllocation !== 100 || !portfolioName}
    className={`w-full py-3 px-6 rounded-lg transition-all flex items-center justify-center font-medium ${
      totalAllocation === 100 && portfolioName
        ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-300'
        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
    }`}
  >
    Create Portfolio <ChevronRight className="ml-2" size={20} />
  </button>
</div>
      </div>
    </div>

    </div>
  );
};

export default NewManagedPortfolio;