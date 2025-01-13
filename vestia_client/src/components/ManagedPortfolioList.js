import React, { useEffect, useState } from 'react';

const ManagedPortfolioList = ({ onSelectPortfolio }) => {
  const [portfolios, setPortfolios] = useState([]);

  useEffect(() => {
    const fetchPortfolios = async () => {
      const response = await fetch('http://localhost:5000/api/managed-portfolios/getManagedPortfolios');
      const data = await response.json();
      setPortfolios(data);
    };

    fetchPortfolios();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800">Select a Managed Portfolio</h2>
      <div className="grid grid-cols-1 gap-4">
        {portfolios.map((portfolio) => (
          <div
            key={portfolio.managed_portfolio_id}
            onClick={() => onSelectPortfolio(portfolio)}
            className="p-6 rounded-xl bg-white shadow-md border border-gray-200 hover:shadow-lg hover:border-indigo-500 cursor-pointer transition-all duration-300 ease-in-out"
          >
            <h3 className="text-lg font-medium text-gray-700">{portfolio.managed_portfolio_name}</h3>
            <p className="text-sm text-gray-500">
              <strong>Strategy:</strong> {portfolio.managed_portfolio_details.strategy}
            </p>
            <p className="text-sm text-gray-500">
              <strong>Description:</strong> {portfolio.managed_portfolio_details.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagedPortfolioList;
