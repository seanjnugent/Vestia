import React, { useMemo, useState, useEffect } from "react";
import { ArrowUp, ArrowDown, PlusCircle, RefreshCw, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";

import { Plus, ChevronRight, Calendar } from "react-feather";

const StatusBadge = ({ status }) => {
  const statusStyles = {
    Completed: "bg-green-100 text-green-800",
    Pending: "bg-yellow-100 text-yellow-800",
    Cancelled: "bg-red-100 text-red-800",
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

const formatDate = (isoString) => {
  if (!isoString) return "Invalid Date";
  try {
    return format(new Date(isoString), "dd MMM yyyy");
  } catch (error) {
    console.error("Error formatting date:", isoString, error);
    return "Invalid Date";
  }
};

const TradesTable = () => {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "date_created",
    direction: "desc",
  });
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrades = async () => {
      const clientId = localStorage.getItem("userId");

      const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
          const parsedDate = parseISO(dateString);
          return format(parsedDate, "dd MMM yyyy");
        } catch (error) {
          return "Invalid Date";
        }
      };


      if (!clientId) {
        setError("No user ID found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:5000/api/trades/client-trades/${clientId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch trades");
        }
        const data = await response.json();
        console.log("Fetched Trades:", data); // Debugging line
        setTrades(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrades();
  }, []);

  const sortedAndFilteredTrades = useMemo(() => {
    let result = [...trades];

    // Filter
    if (filter) {
      result = result.filter((trade) =>
        Object.values(trade).some((value) =>
          value?.toString().toLowerCase().includes(filter.toLowerCase())
        )
      );
    }

    // Sort
    return result.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [trades, sortConfig, filter]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "desc" ? "asc" : "desc",
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw className="animate-spin h-8 w-8 text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6 space-y-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            Trade History
          </h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search trades..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-xl border focus:ring-2 focus:ring-indigo-300 transition-all duration-300"
              />
              <Filter className="absolute left-3 top-3 text-gray-400" />
            </div>
            <button
              onClick={() => navigate("/new-trade")}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg hover:scale-105 transition-all duration-300"
            >
              <PlusCircle size={18} /> New Trade
            </button>
          </div>
        </div>

    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              {[
                { key: "date_created", label: "Date" },
                { key: "asset_code", label: "Asset" },
                { key: "asset_trade_quantity", label: "Quantity" },
                { key: "asset_trade_cost", label: "Cost" },
                { key: "asset_trade_status", label: "Status" },
                { key: "asset_trade_note", label: "Note" },
              ].map(({ key, label }) => (
                <th
                  key={key}
                  onClick={() => handleSort(key)}
                  className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-all duration-300"
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
            </tr>
          </thead>
          <tbody>
            {sortedAndFilteredTrades.map((trade) => (
              <tr
                key={trade.asset_trade_id}
                className="hover:bg-indigo-50 transition-all duration-300 border-b last:border-b-0"
              >
                <td className="px-6 py-4 flex items-center text-gray-800">
                  <Calendar size={16} className="mr-2 text-purple-400" />
                  {formatDate(trade.date_created)}
                </td>
                <td className="px-6 py-4">{trade.asset_code}</td>
                <td className="px-6 py-4">{trade.asset_trade_quantity}</td>
                <td className="px-6 py-4">
                  £
                  {Number(trade.asset_trade_cost).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={trade.asset_trade_status} />
                </td>
                <td className="px-6 py-4">{trade.asset_trade_note || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {sortedAndFilteredTrades.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No trades found 🕹️
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default TradesTable;