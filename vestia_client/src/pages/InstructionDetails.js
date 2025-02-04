import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

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
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black text-white flex items-center justify-center"
      >
        <div className="text-center bg-red-900/50 p-10 rounded-2xl border border-red-700">
          <h2 className="text-4xl font-bold mb-4 text-red-400">Oops!</h2>
          <p className="text-xl text-red-200">{error}</p>
        </div>
      </motion.div>
    );
  }

  if (!instruction) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Loader2 className="h-16 w-16 text-teal-500 animate-spin" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#121212] to-[#1e1e1e] opacity-80 z-0"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-7xl mx-auto px-6 py-12"
      >
        <h1 className="text-5xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-600 mb-12">
          Instruction Details
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* General Information */}
          <motion.div 
            whileHover={{ scale: 1.03 }}
            className="bg-[#1e1e1e] rounded-2xl p-8 border border-[#2c2c2c] shadow-2xl"
          >
            <h2 className="text-2xl font-semibold text-teal-400 mb-6 border-b border-[#2c2c2c] pb-3">
              General Information
            </h2>
            <div className="space-y-4">
              {[
                { label: "Instruction ID", value: instruction.instruction_id },
                { label: "Account ID", value: instruction.account_id },
                { label: "Instruction Type", value: instruction.instruction_type },
                { label: "Instruction Status", value: instruction.instruction_status },
                { label: "Instruction Frequency", value: instruction.instruction_frequency },
                { label: "Instruction Amount", value: instruction.instruction_amount },
                { label: "Bank Account ID", value: instruction.bank_account_id }
              ].map((item, index) => (
                <div key={index} className="flex justify-between border-b border-[#2c2c2c] pb-2">
                  <span className="text-gray-400">{item.label}</span>
                  <span className="text-white font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Dates */}
          <motion.div 
            whileHover={{ scale: 1.03 }}
            className="bg-[#1e1e1e] rounded-2xl p-8 border border-[#2c2c2c] shadow-2xl"
          >
            <h2 className="text-2xl font-semibold text-teal-400 mb-6 border-b border-[#2c2c2c] pb-3">
              Dates
            </h2>
            <div className="space-y-4">
              {[
                { label: "First Date", value: formatDate(instruction.first_date) },
                { label: "Next Run Date", value: formatDate(instruction.next_run_date) },
                { label: "Date Created", value: formatDate(instruction.date_created) },
                { label: "Date Updated", value: formatDate(instruction.date_updated) }
              ].map((item, index) => (
                <div key={index} className="flex justify-between border-b border-[#2c2c2c] pb-2">
                  <span className="text-gray-400">{item.label}</span>
                  <span className="text-white font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Allocations */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-12"
        >
          <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-600 mb-8">
            Allocations
          </h2>

          <AnimatePresence>
            {Array.isArray(instruction.allocation) && instruction.allocation.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-6">
                {instruction.allocation.map((alloc, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ scale: 1.05 }}
                    className="bg-[#1e1e1e] rounded-2xl p-6 border border-[#2c2c2c] shadow-xl"
                  >
                    {[
                      { label: "Asset ID", value: alloc.asset_id },
                      { label: "Asset Name", value: alloc.asset_name },
                      { label: "Asset Code", value: alloc.asset_code },
                      { label: "Allocation Amount", value: alloc.allocation_amount }
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between border-b border-[#2c2c2c] pb-2 mb-2">
                        <span className="text-gray-400">{item.label}</span>
                        <span className="text-white font-medium">{item.value}</span>
                      </div>
                    ))}
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 text-xl">No allocations available.</p>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default InstructionDetails;