import React from 'react';
import PieChart from './PieChart'; // Ensure the path is correct

const ReviewSection = ({ account }) => {
  const { managedPortfolio } = account;

  if (!managedPortfolio) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">Review Your Account</h2>
        <div className="bg-white p-5 rounded-lg shadow-sm">
          <p><strong>Name:</strong> {account.name}</p>
          <p><strong>Type:</strong> {account.type}</p>
          <p><strong>Portfolio:</strong> {account.portfolioType}</p>
          <p>No managed portfolio selected.</p>
        </div>
      </div>
    );
  }

  const pieData = {
    labels: Object.keys(managedPortfolio.allocation),
    datasets: [{
      data: Object.values(managedPortfolio.allocation),
      label: 'Allocation Percentage',
    }],
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800">Review Your Account</h2>
      <div className="bg-white p-5 rounded-lg shadow-sm">
        <p><strong>Name:</strong> {account.name || managedPortfolio.managed_portfolio_name}</p>
        <p><strong>Type:</strong> {account.type}</p>
        <p><strong>Portfolio:</strong> {account.portfolioType}</p>
        <div className="mt-4">
          <p><strong>Managed Portfolio:</strong> {managedPortfolio.managed_portfolio_name}</p>
          <p><strong>Strategy:</strong> {managedPortfolio.managed_portfolio_details.strategy}</p>
          <p><strong>Allocation:</strong></p>
          <PieChart 
            data={pieData} 
            title="Portfolio Allocation"
          />
        </div>
      </div>
    </div>
  );
};

export default ReviewSection;