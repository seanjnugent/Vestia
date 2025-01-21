import React from "react";
import { Link } from "react-router-dom";
import { Plus, ChevronRight, Calendar } from "react-feather";
import { format, parseISO } from "date-fns";

// Refactored PaymentsTable Component with Teal Theme
const PaymentsTable = ({ currentPayments, formatDate, getPaymentType, formatAmount, oneOffPayments, currentPaymentsPage, paginatePayments, renderPaginationButtons }) => (
  <div className="mb-8 bg-white p-6 rounded-lg shadow-lg">
    <h2 className="text-3xl font-bold text-turkishBlue mb-4">Payment History</h2>
    <p className="text-gray-600 mb-6">
      Cash trades for buys, sells, deposits and withdrawals.
    </p>
    <div className="overflow-x-auto rounded-lg shadow-lg">
      <table className="min-w-full bg-cyan-500 border border-cyan-300 rounded-lg">
        <thead className="bg-turkishBlue text-white">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
              Account
            </th>
            <th className="px-6 py-3 text-right text-sm font-semibold uppercase tracking-wider"></th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {currentPayments.length === 0 ? (
            <tr>
              <td colSpan="6" className="px-6 py-4 text-center text-teal-500">
                No payments found
              </td>
            </tr>
          ) : (
            currentPayments.map((payment) => (
              <tr 
                key={payment.cash_trade_id} 
                className="hover:bg-teal-50 transition-all duration-300 border-b border-cyan-300"
              >
                <td className="px-6 py-4 flex items-center text-teal-900">
                  <Calendar size={16} className="mr-2 text-teal-500" />
                  {formatDate(payment.date_created)}
                </td>
                <td className="px-6 py-4 text-teal-900">
                  {getPaymentType(payment.amount)}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      payment.trade_status === "Completed"
                        ? "bg-teal-200 text-teal-800"
                        : "bg-teal-100 text-teal-700"
                    }`}
                  >
                    {payment.trade_status}
                  </span>
                </td>
                <td className="px-6 py-4 text-teal-900">
                  {formatAmount(payment.amount)}
                </td>
                <td className="px-6 py-4 text-teal-900">
                  {payment.trade_note || "N/A"}
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    to={`/payment-details/${payment.cash_trade_id}`}
                    className="text-teal-600 hover:text-teal-800 flex items-center"
                  >
                    View Details <ChevronRight size={16} />
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
    {renderPaginationButtons(
      oneOffPayments.length,
      currentPaymentsPage,
      paginatePayments
    )}
  </div>
);

export default PaymentsTable;