import React from 'react';

const ManagedPortfolioDetails = ({ portfolio }) => {
  const { strategy, description, allocation } = portfolio;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800">Portfolio Details</h2>
      <div className="p-6 rounded-xl bg-white shadow-md border border-gray-200">
        <h3 className="text-lg font-medium text-gray-700">Strategy: {strategy}</h3>
        <p className="text-sm text-gray-500">{description}</p>
        <div className="mt-4">
          <h4 className="text-md font-medium text-gray-700">Allocation:</h4>
          <ul className="list-disc list-inside">
            {Object.entries(allocation).map(([key, value]) => (
              <li key={key} className="text-sm text-gray-500">
                {key}: {value}%
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ManagedPortfolioDetails;