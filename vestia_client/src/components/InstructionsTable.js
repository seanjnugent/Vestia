import React from "react";
import { Link } from "react-router-dom";
import { Plus, ChevronRight, Calendar } from "react-feather";
import { format, parseISO } from "date-fns";

// Refactored InstructionsTable Component with Teal Theme
const InstructionsTable = ({ currentInstructions, formatDate, formatAmount, instructions, currentInstructionsPage, paginateInstructions, renderPaginationButtons }) => (
  <div className="mb-8 bg-white p-6 rounded-lg shadow-lg">
    <h2 className="text-3xl font-bold text-turkishBlue mb-4">Regular Payments</h2>
    <p className="text-gray-600 mb-6">
      Deposit and withdrawal instructions
    </p>
    <div className="overflow-x-auto rounded-lg shadow-lg">
      <table className="min-w-full bg-teal-100 border border-teal-300 rounded-lg">
        <thead className="bg-turkishBlue text-white">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
              Account ID
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
              Frequency
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
              Next Run Date
            </th>
            <th className="px-6 py-3 text-right text-sm font-semibold uppercase tracking-wider"></th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {currentInstructions.length === 0 ? (
            <tr>
              <td colSpan="7" className="px-6 py-4 text-center text-teal-500">
                No instructions found
              </td>
            </tr>
          ) : (
            currentInstructions.map((instruction) => (
              <tr 
                key={instruction.instruction_id} 
                className="hover:bg-teal-50 transition-all duration-300 border-b border-teal-200"
              >
                <td className="px-6 py-4 text-teal-900">
                  {`A${instruction.account_id.toString().padStart(8, '0')}`}
                </td>
                <td className="px-6 py-4 text-teal-900">
                  {instruction.instruction_type}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      instruction.instruction_status === "Active"
                        ? "bg-teal-200 text-teal-800"
                        : "bg-teal-100 text-teal-700"
                    }`}
                  >
                    {instruction.instruction_status}
                  </span>
                </td>
                <td className="px-6 py-4 text-teal-900">
                  {instruction.instruction_frequency}
                </td>
                <td className="px-6 py-4 text-teal-900">
                  {formatAmount(instruction.instruction_amount)}
                </td>
                <td className="px-6 py-4 text-teal-900">
                  {formatDate(instruction.next_run_date)}
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    to={{
                      pathname: `/instruction-details/${instruction.instruction_id}`,
                      state: { instruction },
                    }}
                    className="text-teal-600 hover:text-teal-800 flex items-center"
                  >
                    See Details <ChevronRight size={16} />
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
    {renderPaginationButtons(
      instructions.length,
      currentInstructionsPage,
      paginateInstructions
    )}
  </div>
);

export default InstructionsTable;