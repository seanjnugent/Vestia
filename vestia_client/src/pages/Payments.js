import React, { useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { Plus, ChevronRight, Calendar } from "react-feather";
import { format, parseISO } from "date-fns";
import { useNavigate } from "react-router-dom";

const Payments = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [oneOffPayments, setOneOffPayments] = useState([]);
  const [depositData] = useState([
    {
      id: 1,
      frequency: "Monthly",
      nextDate: "2024-12-25",
      amount: "$1000",
      account: "Personal Account",
    },
  ]);

  const fetchCashTrades = useCallback(async () => {
    const storedClientId = localStorage.getItem("userId");
    if (!storedClientId) {
      setError("Client ID is missing");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/payments/client-payments/${storedClientId}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Received data:", data); // Debug log
      setOneOffPayments(Array.isArray(data) ? data : []);
      setIsLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetchCashTrades();
  }, [fetchCashTrades]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const parsedDate = parseISO(dateString);
      return format(parsedDate, "dd MMM yyyy");
    } catch (error) {
      return "Invalid Date";
    }
  };

  const formatAmount = (amount) => {
    if (amount == null) return "N/A";
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(Math.abs(amount));
    } catch (error) {
      return "Invalid Amount";
    }
  };

  const getPaymentType = (amount) => amount >= 0 ? "Deposit" : "Withdrawal";

  const PaymentsTable = () => (
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
        {oneOffPayments.length === 0 ? (
          <tr>
            <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
              No payments found
            </td>
          </tr>
        ) : (
          oneOffPayments.map((payment) => (
            <tr key={payment.cash_trade_id} className="hover:bg-purple-50 transition">
              <td className="px-6 py-4 flex items-center text-gray-800">
                <Calendar size={16} className="mr-2 text-purple-400" />
                {formatDate(payment.date_created)}
              </td>
              <td className="px-6 py-4 text-gray-800">{getPaymentType(payment.amount)}</td>
              <td className="px-6 py-4 text-gray-800">{formatAmount(payment.amount)}</td>
              <td className="px-6 py-4 text-gray-800">{payment.cash_trade_note || 'N/A'}</td>
              <td className="px-6 py-4 text-right">
                <Link
                  to={`/payment-details/${payment.cash_trade_id}`}
                  className="text-purple-600 hover:text-purple-900 flex items-center"
                >
                  View Details <ChevronRight size={16} />
                </Link>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );

  return (
    <div className="min-h-screen bg-white p-6 space-y-6">
      <div className="px-8 py-10">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
          Payments Dashboard
        </h1>

        {/* One-Off Payments Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">Payment History</h2>
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg flex items-center space-x-2 transition duration-200">
              <Plus size={18} /> <span>New Payment</span>
            </button>
          </div>
          
          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              {error}
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : (
            <PaymentsTable />
          )}
        </section>

        {/* Regular Deposits Section */}
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
                    <td className="px-6 py-4 text-sm text-gray-900">{deposit.account}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{deposit.amount}</td>
                    <td className="px-6 py-4 text-right text-sm">
                      <Link
                        to={`/regular-deposit/${deposit.id}`}
                        className="text-purple-600 hover:text-purple-900 flex items-center"
                      >
                        View Details <ChevronRight size={16} />
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
  );
};

export default Payments;