import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { BeatLoader } from "react-spinners";
import { motion } from "framer-motion";

const InstructionDetails = () => {
  const { id } = useParams();
  const [instruction, setInstruction] = useState(null);
  const [error, setError] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const parsedDate = parseISO(dateString);
      return format(parsedDate, "dd MMM yyyy");
    } catch (error) {
      return "Invalid Date";
    }
  };

  useEffect(() => {
    const fetchInstruction = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/payments/getInstructionDetails/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch instruction details");
        }
        const data = await response.json();
        setInstruction(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchInstruction();
  }, [id]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-teal-50 to-white">
        <div className="p-8 bg-red-100 rounded-lg shadow-lg text-red-600">
          <h2 className="text-2xl font-bold mb-4">Error:</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!instruction) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-teal-50 to-white">
        <BeatLoader color="#38d6b7" size={15} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white py-12 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-4xl font-bold text-[#1e90a7] text-center mb-10">
          Instruction Details
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div
            className="p-6 bg-gray-50 rounded-lg shadow-lg"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              General Information
            </h2>
            <p className="text-lg">
              <strong className="text-gray-600">Instruction ID:</strong> {instruction.instruction_id}
            </p>
            <p className="text-lg">
              <strong className="text-gray-600">Account ID:</strong> {instruction.account_id}
            </p>
            <p className="text-lg">
              <strong className="text-gray-600">Instruction Type:</strong> {instruction.instruction_type}
            </p>
            <p className="text-lg">
              <strong className="text-gray-600">Instruction Status:</strong> {instruction.instruction_status}
            </p>
            <p className="text-lg">
              <strong className="text-gray-600">Instruction Frequency:</strong> {instruction.instruction_frequency}
            </p>
            <p className="text-lg">
              <strong className="text-gray-600">Instruction Amount:</strong> {instruction.instruction_amount}
            </p>
            <p className="text-lg">
              <strong className="text-gray-600">Bank Account ID:</strong> {instruction.bank_account_id}
            </p>
          </div>
          <div
            className="p-6 bg-gray-50 rounded-lg shadow-lg"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Dates</h2>
            <p className="text-lg">
              <strong className="text-gray-600">First Date:</strong> {formatDate(instruction.first_date)}
            </p>
            <p className="text-lg">
              <strong className="text-gray-600">Next Run Date:</strong> {formatDate(instruction.next_run_date)}
            </p>
            <p className="text-lg">
              <strong className="text-gray-600">Date Created:</strong> {formatDate(instruction.date_created)}
            </p>
            <p className="text-lg">
              <strong className="text-gray-600">Date Updated:</strong> {formatDate(instruction.date_updated)}
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mt-10 mb-4">
          Allocations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(instruction.allocation) && instruction.allocation.length > 0 ? (
            instruction.allocation.map((alloc, index) => (
              <motion.div
                key={index}
                className="p-4 bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105"
              >
                <p className="text-lg">
                  <strong className="text-gray-600">Asset ID:</strong> {alloc.asset_id}
                </p>
                <p className="text-lg">
                  <strong className="text-gray-600">Asset Name:</strong> {alloc.asset_name}
                </p>
                <p className="text-lg">
                  <strong className="text-gray-600">Asset Code:</strong> {alloc.asset_code}
                </p>
                <p className="text-lg">
                  <strong className="text-gray-600">Allocation Amount:</strong> {alloc.allocation_amount}
                </p>
              </motion.div>
            ))
          ) : (
            <p className="text-lg text-gray-600">No allocations available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructionDetails;
