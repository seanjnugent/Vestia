import React from 'react';
import { PiggyBank } from 'lucide-react';

const AnnualAllowance = ({ accountDetails }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <PiggyBank className="w-5 h-5 text-pink-500" />
        <h2 className="text-xl font-semibold">ISA Allowance {accountDetails?.isaTaxYear}</h2>
      </div>
      <div className="space-y-2">
        <div className="w-full bg-gray-100 rounded-full h-2.5">
          <div
            className="bg-gradient-to-r from-pink-500 to-violet-500 h-2.5 rounded-full"
            style={{
              width: `${Math.min(
                (Number(accountDetails?.availableToInvest?.replace('£', '').replace(/,/g, '') || 0) /
                  Number(accountDetails?.yearlyAllowance?.replace('£', '').replace(/,/g, '') || 1)) *
                  100,
                100
              )}%`,
            }}
          />
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Available: {accountDetails?.availableToInvest}</span>
          <span>Allowance: {accountDetails?.yearlyAllowance}</span>
        </div>
      </div>
    </div>
  );
};

export default AnnualAllowance;
