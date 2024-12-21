import React, { useState } from 'react';

const NewAsset = () => {
  const [assetCode, setAssetCode] = useState('');
  const [assetDetails, setAssetDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_KEY = 'your_alpha_vantage_api_key'; // Replace with your Alpha Vantage API key

  // Function to fetch asset details from Alpha Vantage API
  const fetchAssetDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      // First, fetch the Global Quote (for price and market data)
      const quoteResponse = await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${assetCode}&apikey=${API_KEY}`
      );
      const quoteData = await quoteResponse.json();

      // If Global Quote exists, fetch the company overview
      if (quoteData['Global Quote']) {
        const { '01. symbol': symbol, '05. price': price, '08. previous close': previousClose, '02. open': open, '09. change': change, '10. change percent': changePercent } = quoteData['Global Quote'];

        // Fetch the Company Overview for more details (like name, sector, industry)
        const overviewResponse = await fetch(
          `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${assetCode}&apikey=${API_KEY}`
        );
        const overviewData = await overviewResponse.json();

        // Set the detailed asset data including company info
        setAssetDetails({
          symbol,
          price,
          previousClose,
          open,
          change,
          changePercent,
          name: overviewData.Name,
          sector: overviewData.Sector,
          industry: overviewData.Industry,
          marketCap: overviewData.MarketCapitalization,
          description: overviewData.Description,
        });
      } else {
        setError('Asset not found or API limit exceeded.');
      }
    } catch (err) {
      setError('Failed to fetch asset details.');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle asset addition
  const handleAddAsset = () => {
    alert(`Asset ${assetCode} added to Vestia.`);
    // Here you can perform the actual add operation, e.g., making an API call to your server
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold text-center">New Fund</h1>
      <div className="mt-6 space-y-6">
        {/* Step 1: Enter Asset Code */}
        <div>
          <label htmlFor="assetCode" className="block text-sm font-medium text-gray-700">Enter Asset Code (e.g., AAPL for Apple):</label>
          <input
            type="text"
            id="assetCode"
            value={assetCode}
            onChange={(e) => setAssetCode(e.target.value)}
            className="mt-2 p-3 border border-gray-300 rounded-md w-full"
            placeholder="Asset Code"
          />
        </div>

        {/* Step 2: Retrieve Asset Details */}
        <div className="text-center">
          <button
            onClick={fetchAssetDetails}
            disabled={loading || !assetCode}
            className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Retrieving Details...' : 'Retrieve Details'}
          </button>
        </div>

        {/* Display error message */}
        {error && <div className="text-red-500 text-center">{error}</div>}

        {/* Step 3: Display Asset Details for Review */}
        {assetDetails && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Asset Details</h2>
            <div className="space-y-2">
              <p><strong>Symbol:</strong> {assetDetails.symbol}</p>
              <p><strong>Name:</strong> {assetDetails.name}</p>
              <p><strong>Sector:</strong> {assetDetails.sector}</p>
              <p><strong>Industry:</strong> {assetDetails.industry}</p>
              <p><strong>Market Cap:</strong> {assetDetails.marketCap}</p>
              <p><strong>Price:</strong> ${assetDetails.price}</p>
              <p><strong>Previous Close:</strong> ${assetDetails.previousClose}</p>
              <p><strong>Open:</strong> ${assetDetails.open}</p>
              <p><strong>Change:</strong> {assetDetails.change}</p>
              <p><strong>Change Percentage:</strong> {assetDetails.changePercent}</p>
              <p><strong>Description:</strong> {assetDetails.description}</p>
            </div>
          </div>
        )}

        {/* Step 4: Add Asset to Vestia */}
        {assetDetails && (
          <div className="text-center">
            <button
              onClick={handleAddAsset}
              className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Add Asset to Vestia
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewAsset;
