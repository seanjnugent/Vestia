import { useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, ChevronRight } from "react-feather"; // You can import icons for a sleek design

const RegularPayments = () => {
  const [depositData, setDepositData] = useState([
    {
      id: 1,
      frequency: "Monthly",
      nextDate: "2024-12-25",
      amount: "$1000",
      details: [
        { asset: "Tesla", amount: "$200" },
        { asset: "Google", amount: "$600" },
        { asset: "AAPL", amount: "$200" },
      ],
    },
    {
      id: 2,
      frequency: "Weekly",
      nextDate: "2024-12-22",
      amount: "$500",
      details: [
        { asset: "Tesla", amount: "$150" },
        { asset: "AAPL", amount: "$350" },
      ],
    },
  ]);

  const [withdrawalData, setWithdrawalData] = useState([
    {
      id: 1,
      frequency: "Monthly",
      nextDate: "2024-12-25",
      percentage: "5%",
    },
    {
      id: 2,
      frequency: "Quarterly",
      nextDate: "2025-01-01",
      percentage: "10%",
    },
  ]);

  const renderDepositDetails = (details) => {
    return details.map((detail, index) => (
      <p key={index} className="text-sm text-gray-500">
        {detail.asset}: {detail.amount}
      </p>
    ));
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg">
      <h1 className="text-4xl font-semibold text-center mb-8">Regular Payments</h1>

      <div className="space-y-12">
        {/* Regular Deposits Section */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Regular Deposits</h2>
          <p className="text-lg text-gray-600 mb-4">
            Set up a regular deposit to automatically purchase and allocate funds to your assets.
          </p>
          <button
            className="text-white bg-blue-600 hover:bg-blue-700 rounded-full py-2 px-6 flex items-center space-x-2"
            onClick={() => alert("Create new deposit")}
          >
            <PlusCircle />
            <span>Create New Deposit</span>
          </button>

          <div className="mt-6">
            <table className="w-full table-auto text-left">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="py-2 text-sm text-gray-600">Frequency</th>
                  <th className="py-2 text-sm text-gray-600">Next Date</th>
                  <th className="py-2 text-sm text-gray-600">Amount</th>
                  <th className="py-2 text-sm text-gray-600">Details</th>
                </tr>
              </thead>
              <tbody>
                {depositData.map((deposit) => (
                  <tr key={deposit.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 text-sm text-gray-800">{deposit.frequency}</td>
                    <td className="py-4 text-sm text-gray-800">{deposit.nextDate}</td>
                    <td className="py-4 text-sm text-gray-800">{deposit.amount}</td>
                    <td className="py-4 text-sm text-blue-600 cursor-pointer">
                      <Link to={`/payment-details/${deposit.id}`} className="flex items-center space-x-1">
                        <span>View Details</span>
                        <ChevronRight className="text-xs" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Regular Withdrawals Section */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Regular Withdrawals</h2>
          <p className="text-lg text-gray-600 mb-4">
            Set up a regular withdrawal to withdraw a percentage of your balance automatically.
          </p>
          <button
            className="text-white bg-blue-600 hover:bg-blue-700 rounded-full py-2 px-6 flex items-center space-x-2"
            onClick={() => alert("Create new withdrawal")}
          >
            <PlusCircle />
            <span>Create New Withdrawal</span>
          </button>

          <div className="mt-6">
            <table className="w-full table-auto text-left">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="py-2 text-sm text-gray-600">Frequency</th>
                  <th className="py-2 text-sm text-gray-600">Next Date</th>
                  <th className="py-2 text-sm text-gray-600">Percentage</th>
                  <th className="py-2 text-sm text-gray-600">Details</th>
                </tr>
              </thead>
              <tbody>
                {withdrawalData.map((withdrawal) => (
                  <tr key={withdrawal.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 text-sm text-gray-800">{withdrawal.frequency}</td>
                    <td className="py-4 text-sm text-gray-800">{withdrawal.nextDate}</td>
                    <td className="py-4 text-sm text-gray-800">{withdrawal.percentage}</td>
                    <td className="py-4 text-sm text-blue-600 cursor-pointer">
                      <Link to={`/withdrawal-details/${withdrawal.id}`} className="flex items-center space-x-1">
                        <span>View Details</span>
                        <ChevronRight className="text-xs" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default RegularPayments;
