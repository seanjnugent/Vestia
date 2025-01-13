import React from 'react';
import { Table } from 'lucide-react';

const HoldingsTable = ({ holdings }) => {
  const totalValue = holdings.reduce((sum, holding) => sum + Number(holding.asset_value), 0);
  const totalPerformance = holdings.reduce((sum, holding) => sum + Number(holding.net_performance), 0);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 relative">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Table className="text-[#38d6b7] w-6 h-6" />
            Holdings Detail
          </h2>
          <p className="text-4xl font-bold text-gray-900 mt-2 tracking-tight">
            £{totalValue.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="text-right">
          <p className={`text-2xl font-bold ${totalPerformance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {totalPerformance >= 0 ? '+' : ''}£{totalPerformance.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-gray-600">Net Performance</p>
        </div>
      </div>

      {/* Scrollable Table */}
      <div className="overflow-y-auto max-h-96">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-gray-600 font-medium">Asset</th>
              <th className="text-right py-3 px-4 text-gray-600 font-medium">Units Held</th>
              <th className="text-right py-3 px-4 text-gray-600 font-medium">Value (£)</th>
              <th className="text-right py-3 px-4 text-gray-600 font-medium">Net Performance (£)</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((holding, index) => (
              <tr 
                key={index} 
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="py-3 px-4 font-medium">{holding.asset_code}</td>
                <td className="py-3 px-4 text-right">
                  {Number(holding.asset_holding).toLocaleString()}
                </td>
                <td className="py-3 px-4 text-right">
                  £{Number(holding.asset_value).toLocaleString()}
                </td>
                <td className={`py-3 px-4 text-right ${Number(holding.net_performance) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {Number(holding.net_performance) >= 0 ? '+' : ''}
                  £{Number(holding.net_performance).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
          {/* Footer */}
          <tfoot>
            <tr className="border-t border-gray-200">
              <td className="py-3 px-4 font-medium text-gray-900">Total</td>
              <td className="py-3 px-4"></td>
              <td className="py-3 px-4 text-right font-medium text-gray-900">
                £{totalValue.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>
              <td className={`py-3 px-4 text-right font-medium ${totalPerformance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {totalPerformance >= 0 ? '+' : ''}
                £{totalPerformance.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default HoldingsTable;
