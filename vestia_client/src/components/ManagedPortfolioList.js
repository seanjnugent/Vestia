import React, { useState, useEffect } from 'react';
import ManagedPortfolioDetails from './ManagedPortfolioDetails';

const ManagedPortfolioList = ({ onSelectPortfolio }) => {
  const [portfolios, setPortfolios] = useState([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const fetchPortfolios = async () => {
      const response = await fetch('http://localhost:5000/api/managed-portfolios/getManagedPortfolios');
      const data = await response.json();
      setPortfolios(data);
    };
    fetchPortfolios();
  }, []);

  const handleSelectPortfolio = (portfolio) => {
    setSelectedPortfolio(portfolio);
    onSelectPortfolio(portfolio);
  };

  const handleSeeDetails = (portfolio) => {
    setSelectedPortfolio(portfolio);
    setShowDetails(true);
  };

  const handleBackToList = () => {
    setShowDetails(false);
  };

  if (showDetails) {
    return (
      <div className="space-y-4">
        <button onClick={handleBackToList} className="text-indigo-600 hover:underline">
          Back to List
        </button>
        <ManagedPortfolioDetails portfolio={selectedPortfolio} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800">Select a Managed Portfolio</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {portfolios.length === 0 ? (
          <div className="col-span-full text-center">Loading portfolios...</div>
        ) : (
          portfolios.map((portfolio) => (
            <div
              key={portfolio.managed_portfolio_id}
              onClick={() => handleSelectPortfolio(portfolio)}
              className={`p-6 rounded-xl bg-white shadow-md border border-gray-200 hover:shadow-lg hover:border-indigo-600 cursor-pointer transition-all duration-300
                ${selectedPortfolio && selectedPortfolio.managed_portfolio_id === portfolio.managed_portfolio_id ? 'border-indigo-600 bg-indigo-50' : ''}`}
            >
              <h3 className="text-lg font-medium text-gray-700">{portfolio.managed_portfolio_name}</h3>
              <p className="text-sm text-gray-500">
                <strong>Strategy:</strong> {portfolio.managed_portfolio_details.strategy}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Description:</strong> {portfolio.managed_portfolio_details.description}
              </p>
              <button
                onClick={(e) => { e.stopPropagation(); handleSeeDetails(portfolio); }}
                className="mt-2 text-indigo-600 hover:underline"
              >
                See Details
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManagedPortfolioList;