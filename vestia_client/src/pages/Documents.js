import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Trash2, Eye, Upload } from "lucide-react";

const Documents = () => {
  const [documents, setDocuments] = useState({
    statements: [],
    tradingNotes: [],
    accountDocs: [],
  });

  const [selectedCategory, setSelectedCategory] = useState("statements");
  const [uploadedFile, setUploadedFile] = useState(null);

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setDocuments((prev) => ({
        ...prev,
        [selectedCategory]: [
          ...prev[selectedCategory],
          { 
            name: file.name, 
            url: URL.createObjectURL(file),
            uploadDate: new Date().toISOString()
          },
        ],
      }));
      setUploadedFile(null);
    }
  };

  // Handle document deletion
  const handleDeleteDocument = (index) => {
    setDocuments((prev) => ({
      ...prev,
      [selectedCategory]: prev[selectedCategory].filter((_, i) => i !== index)
    }));
  };

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
          Document Management
        </h1>

        {/* Category Tabs */}
        <div className="flex justify-center space-x-6 mb-12">
          {["statements", "tradingNotes", "accountDocs"].map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-teal-500 to-cyan-600 text-white"
                  : "bg-[#1e1e1e] text-gray-500 hover:text-white border border-[#2c2c2c]"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category === "statements"
                ? "Statements"
                : category === "tradingNotes"
                ? "Trading Notes"
                : "Account Documents"}
            </motion.button>
          ))}
        </div>

        {/* Upload Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="max-w-xl mx-auto mb-12 bg-[#1e1e1e] rounded-2xl p-8 border border-[#2c2c2c] shadow-2xl"
        >
          <div className="flex items-center space-x-4 mb-4">
            <Upload className="text-teal-500 h-8 w-8" />
            <label className="text-xl font-semibold text-gray-300">Upload a Document</label>
          </div>
          <input
            type="file"
            className="w-full p-4 bg-black border border-[#2c2c2c] rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-teal-500 file:text-white hover:file:bg-teal-600"
            onChange={handleFileUpload}
          />
          <p className="text-sm text-gray-500 mt-2">
            Files will be stored under the {selectedCategory} category.
          </p>
        </motion.div>

        {/* Document List */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-600 mb-8">
            {selectedCategory === "statements"
              ? "Statements"
              : selectedCategory === "tradingNotes"
              ? "Trading Notes"
              : "Account Documents"}
          </h2>

          <AnimatePresence>
            {documents[selectedCategory].length > 0 ? (
              <div className="space-y-4">
                {documents[selectedCategory].map((doc, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-between bg-[#1e1e1e] rounded-2xl p-6 border border-[#2c2c2c] shadow-xl"
                  >
                    <div className="flex items-center space-x-4">
                      <FileText className="text-teal-500 h-8 w-8" />
                      <div>
                        <p className="text-white font-semibold">{doc.name}</p>
                        <p className="text-gray-500 text-sm">
                          Uploaded on {new Date(doc.uploadDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <motion.a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1 }}
                        className="text-teal-500 hover:text-teal-400"
                      >
                        <Eye className="h-6 w-6" />
                      </motion.a>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => handleDeleteDocument(index)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <Trash2 className="h-6 w-6" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-gray-500 text-xl"
              >
                No documents available in this category.
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Documents;