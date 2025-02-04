import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Plus, ChevronRight, Calendar, Filter, ArrowUp, ArrowDown, ChevronLeft, ChevronRight as ChevronRightIcon } from "react-feather";
import { format, parseISO } from "date-fns";

const StatusBadge = ({ status }) => {
  const statusStyles = {
    Active: "bg-green-100 text-green-800",
    Pending: "bg-orange-100 text-orange-800",
    Inactive: "bg-gray-100 text-gray-800",
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        statusStyles[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
};

const InstructionsTable = ({ instructions, formatAmount, formatDate }) => {
  const [sortConfig, setSortConfig] = useState({
    key: "next_run_date",
    direction: "desc",
  });
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const sortedAndFilteredInstructions = useMemo(() => {
    let result = [...instructions];

    if (filter) {
      result = result.filter((instruction) =>
        Object.values(instruction).some((value) =>
          value?.toString().toLowerCase().includes(filter.toLowerCase())
        )
      );
    }

    return result.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [instructions, sortConfig, filter]);

  // Pagination calculations
  const totalPages = Math.ceil(sortedAndFilteredInstructions.length / itemsPerPage);
  const paginatedInstructions = sortedAndFilteredInstructions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "desc" ? "asc" : "desc",
    }));
  };

  const Pagination = () => {
    return (
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, sortedAndFilteredInstructions.length)}
              </span> of{' '}
              <span className="font-medium">{sortedAndFilteredInstructions.length}</span> results
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus:outline-offset-0 ${
                    currentPage === page
                      ? "bg-[#00836f] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00836f]"
                      : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white p-6 space-y-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-turkishBlue mb-4">
            Regular Payments
          </h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search instructions..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-xl border focus:ring-2 focus:ring-[#00836f] transition-all duration-300"
              />
              <Filter className="absolute left-3 top-3 text-gray-400" />
            </div>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-[#00836f] text-white rounded-xl shadow-lg hover:scale-105 transition-all duration-300"
            >
              <Plus size={18} /> New Instruction
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <table className="w-full border-collapse bg-white">
            <thead className="bg-[#f1f5f9]">
              <tr>
                {[
                  { key: "account_id", label: "Account ID" },
                  { key: "instruction_type", label: "Type" },
                  { key: "instruction_status", label: "Status" },
                  { key: "instruction_frequency", label: "Frequency" },
                  { key: "instruction_amount", label: "Amount" },
                  { key: "next_run_date", label: "Next Run Date" },
                ].map(({ key, label }) => (
                  <th
                    key={key}
                    onClick={() => handleSort(key)}
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b cursor-pointer hover:bg-gray-200 transition-all duration-300"
                  >
                    <div className="flex items-center gap-2">
                      {label}
                      {sortConfig.key === key &&
                        (sortConfig.direction === "asc" ? (
                          <ArrowUp size={16} />
                        ) : (
                          <ArrowDown size={16} />
                        ))}
                    </div>
                  </th>
                ))}
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 border-b">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedInstructions.map((instruction) => (
                <tr
                  key={instruction.instruction_id}
                  className="hover:bg-[#f9fafb] border-b last:border-b-0"
                >
                  <td className="px-4 py-3 text-gray-800">
                    {`A${instruction.account_id.toString().padStart(8, '0')}`}
                  </td>
                  <td className="px-4 py-3">{instruction.instruction_type}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={instruction.instruction_status} />
                  </td>
                  <td className="px-4 py-3">{instruction.instruction_frequency}</td>
                  <td className="px-4 py-3">
                    {formatAmount(instruction.instruction_amount)}
                  </td>
                  <td className="px-4 py-3 flex items-center">
                    <Calendar size={16} className="mr-2 text-[#00836f]" />
                    {formatDate(instruction.next_run_date)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={{
                        pathname: `/instruction-details/${instruction.instruction_id}`,
                        state: { instruction },
                      }}
                      className="text-[#00836f] hover:underline"
                    >
                      Details <ChevronRight size={16} className="inline" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {sortedAndFilteredInstructions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No instructions found 📝
            </div>
          )}

          <Pagination />
        </div>
      </div>
    </div>
  );
};

export default InstructionsTable;