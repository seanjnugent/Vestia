import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, ChevronRight, Calendar, Clock } from "react-feather";
import { format, parseISO } from "date-fns";

const Payments = () => {
  const [oneOffPayments, setOneOffPayments] = useState([
    { id: 1, date: "2024-12-15", type: "Deposit", amount: "$500", account: "Savings" },
    { id: 2, date: "2024-12-12", type: "Withdrawal", amount: "$300", account: "Personal" },
    { id: 3, date: "2024-12-10", type: "Deposit", amount: "$700", account: "Business" },
    // Add more items as needed
  ]);

  const [depositData, setDepositData] = useState([
    {
      id: 1,
      frequency: "Monthly",
      nextDate: "2024-12-25",
      amount: "$1000",
      account: "Personal Account",
    },
  ]);

  const [withdrawalData, setWithdrawalData] = useState([
    {
      id: 1,
      frequency: "Monthly",
      nextDate: "2024-12-25",
      percentage: "5%",
    },
  ]);

  const formatDate = (dateString) => {
    try {
      const parsedDate = parseISO(dateString);
      return format(parsedDate, "dd MMM yyyy");
    } catch (error) {
      console.error("Error parsing date:", error);
      return "Invalid Date";
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="px-8 py-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">Payments</h1>

          {/* One-Off Payments Section */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 tracking-tight">
                Payment History
              </h2>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center space-x-2 transition duration-200">
                <Plus size={18} /> <span>New One-Off Payment</span>
              </button>
            </div>

            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Account
                  </th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {oneOffPayments.slice(0, 5).map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-6 py-4 text-sm text-gray-900 flex items-center">
                      <Calendar size={16} className="mr-2 text-gray-400" />
                      {formatDate(payment.date)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{payment.type}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{payment.amount}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{payment.account}</td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <Link
                        to={`/payment-details/${payment.id}`}
                        className="text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        <span>View Details</span>
                        <ChevronRight size={16} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-right mt-4">
              <Link
                to="/all-one-off-payments"
                className="text-blue-600 hover:underline text-sm"
              >
                See full payment history
              </Link>
            </div>
          </section>

           {/* Regular Payments Section */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 tracking-tight">
                Regular Payments
              </h2>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center space-x-2 transition duration-200">
                <Plus size={18} /> <span>New Regular Payment</span>
              </button>
            </div>

            {/* Deposits Section */}
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Regular Deposits
            </h3>
            {depositData.length === 0 ? (
              <p className="text-gray-500">No deposits set up yet.</p>
            ) : (
              <table className="min-w-full divide-y divide-gray-200 mb-8">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Frequency
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Next Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Account
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Amount
                    </th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {depositData.map((deposit) => (
                    <tr key={deposit.id}>
                      <td className="px-6 py-4 text-sm text-gray-900 flex items-center">
                        <Clock size={16} className="mr-2 text-gray-400" />
                        {deposit.frequency}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 flex items-center">
                        <Calendar size={16} className="mr-2 text-gray-400" />
                        {formatDate(deposit.nextDate)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {deposit.account}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {deposit.amount}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <Link
                          to={`/payment-details/${deposit.id}`}
                          className="text-blue-600 hover:text-blue-800 flex items-center"
                        >
                          <span>View Details</span>
                          <ChevronRight size={16} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Withdrawals Section */}
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Regular Withdrawals
            </h3>
            {withdrawalData.length === 0 ? (
              <p className="text-gray-500">No withdrawals set up yet.</p>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Frequency
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Next Withdrawal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Percentage
                    </th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {withdrawalData.map((withdrawal) => (
                    <tr key={withdrawal.id}>
                      <td className="px-6 py-4 text-sm text-gray-900 flex items-center">
                        <Clock size={16} className="mr-2 text-gray-400" />
                        {withdrawal.frequency}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 flex items-center">
                        <Calendar size={16} className="mr-2 text-gray-400" />
                        {formatDate(withdrawal.nextDate)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {withdrawal.percentage}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <Link
                          to={`/withdrawal-details/${withdrawal.id}`}
                          className="text-blue-600 hover:text-blue-800 flex items-center"
                        >
                          <span>View Details</span>
                          <ChevronRight size={16} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Payments;
