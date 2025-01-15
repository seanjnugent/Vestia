import React from 'react';
import PieChart from './PieChart'; // Make sure this path is correct based on your file structure

const ManagedPortfolioDetails = ({ portfolio }) => {
  if (!portfolio) return <div className="text-center">Loading...</div>;

  const { strategy, description } = portfolio.managed_portfolio_details;
  const { allocation } = portfolio;

  // Data preparation for the pie chart
  const pieData = {
    labels: Object.keys(allocation),
    datasets: [{
      data: Object.values(allocation),
      label: 'Allocation Percentage',
    }],
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800">Portfolio Details</h2>
      <div className="p-6 rounded-xl bg-white shadow-md border border-gray-200">
        <h3 className="text-lg font-medium text-gray-700">Strategy: {strategy}</h3>
        <p className="text-sm text-gray-500">{description}</p>
        <div className="mt-4">
          <h4 className="text-md font-medium text-gray-700">Allocation:</h4>
          <PieChart 
  data={{
    labels: Object.keys(allocation),
    datasets: [{
      data: Object.values(allocation),
      label: 'Allocation Percentage',
    }],
  }}
  title="Portfolio Allocation"
/>        </div>
      </div>
    </div>
  );
};

export default ManagedPortfolioDetails;