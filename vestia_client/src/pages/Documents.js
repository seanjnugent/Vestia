import React, { useState } from "react";

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
          { name: file.name, url: URL.createObjectURL(file) },
        ],
      }));
      setUploadedFile(null);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 space-y-6">
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Documents</h1>

      {/* Category Tabs */}
      <div className="flex space-x-4 mb-6">
        {["statements", "tradingNotes", "accountDocs"].map((category) => (
          <button
            key={category}
            className={`px-4 py-2 rounded-lg ${
              selectedCategory === category
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category === "statements"
              ? "Statements"
              : category === "tradingNotes"
              ? "Trading Notes"
              : "Account Documents"}
          </button>
        ))}
      </div>

      {/* Upload Section */}
      <div className="mb-6">
        <label className="block text-gray-700 mb-2">Upload a file</label>
        <input
          type="file"
          className="w-full p-2 border border-gray-300 rounded-lg"
          onChange={handleFileUpload}
        />
        <p className="text-sm text-gray-500 mt-2">
          Files will be stored under the selected category.
        </p>
      </div>

      {/* Document List */}
      <h2 className="text-lg font-semibold mb-4">
        {selectedCategory === "statements"
          ? "Statements"
          : selectedCategory === "tradingNotes"
          ? "Trading Notes"
          : "Account Documents"}
      </h2>
      <ul>
        {documents[selectedCategory].length > 0 ? (
          documents[selectedCategory].map((doc, index) => (
            <li
              key={index}
              className="flex justify-between items-center py-2 px-4 bg-gray-100 rounded-lg mb-2"
            >
              <span>{doc.name}</span>
              <div>
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline mr-4"
                >
                  Preview
                </a>
                <button className="bg-red-500 text-white px-3 py-1 rounded-lg">
                  Delete
                </button>
              </div>
            </li>
          ))
        ) : (
          <p className="text-gray-500">No documents available in this category.</p>
        )}
      </ul>
    </div>
  );
};

export default Documents;
