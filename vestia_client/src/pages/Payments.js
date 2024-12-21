import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, ChevronRight, Calendar, Clock } from "react-feather";
import { format, parseISO } from "date-fns";
import { useNavigate } from "react-router-dom";

const Payments = () => {
  const [oneOffPayments, setOneOffPayments] = useState([
    { id: 1, date: "2024-12-15", type: "Deposit", amount: "$500", account: "Savings" },
    { id: 2, date: "2024-12-12", type: "Withdrawal", amount: "$300", account: "Personal" },
    { id: 3, date: "2024-12-10", type: "Deposit", amount: "$700", account: "Business" },
  ]);

  const navigate = useNavigate();

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
      account: "Personal Account",
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-100 to-purple-200 p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="px-8 py-10">
          <h1 className="text-4xl font-extrabold text-purple-900 mb-6 tracking-tight">
            💸 Payments Dashboard
          </h1>

          {/* One-Off Payments Section */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">Payment History</h2>
              <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg flex items-center space-x-2 transition duration-200">
                <Plus size={18} /> <span>New Payment</span>
              </button>
            </div>
            <table className="w-full table-auto border-collapse bg-white rounded-lg shadow-sm">
              <thead className="bg-purple-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Type</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Amount</th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Account</th>
                  <th className="px-6 py-3 text-sm font-bold"></th>
                </tr>
              </thead>
              <tbody>
                {oneOffPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-purple-50 transition">
                    <td className="px-6 py-4 flex items-center text-gray-800">
                      <Calendar size={16} className="mr-2 text-purple-400" />
                      {formatDate(payment.date)}
                    </td>
                    <td className="px-6 py-4 text-gray-800">{payment.type}</td>
                    <td className="px-6 py-4 text-gray-800">{payment.amount}</td>
                    <td className="px-6 py-4 text-gray-800">{payment.account}</td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/payment-details/${payment.id}`}
                        className="text-purple-600 hover:text-purple-900 flex items-center"
                      >
                        View Details <ChevronRight size={16} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Regular Payments Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">Regular Payments</h2>
              <button
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg flex items-center space-x-2 transition duration-200"
                onClick={() => navigate("/new-regular-payment")}
              >
                <Plus size={18} /> <span>New Regular Payment</span>
              </button>
            </div>

     {/* Regular Deposits Section */}
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
          Next Payment Date
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
          <td className="px-6 py-4 text-sm text-gray-900">
            {deposit.frequency}
          </td>
          <td className="px-6 py-4 text-sm text-gray-900">
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

{/* Regular Withdrawals Section */}
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
          Next Withdrawal Date
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
          Account
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
          <td className="px-6 py-4 text-sm text-gray-900">
            {withdrawal.frequency}
          </td>
          <td className="px-6 py-4 text-sm text-gray-900">
            {formatDate(withdrawal.nextDate)}
          </td>
          <td className="px-6 py-4 text-sm text-gray-900">
            {withdrawal.account}
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
