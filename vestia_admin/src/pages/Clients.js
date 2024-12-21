import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { ArrowUpRight, Search, UserPlus } from 'lucide-react';

const Clients = () => {
  const navigate = useNavigate();

  const [clients, setClients] = useState([
    { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' },
    { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com' },
    { id: 3, firstName: 'Alex', lastName: 'Johnson', email: 'alex.johnson@example.com' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');

  const filteredClients = clients.filter(
    (client) =>
      client.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-violet-500 text-transparent bg-clip-text">
            Clients
          </h1>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search for clients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all"
        />
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-pink-100">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-pink-50 to-violet-50">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">First Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Last Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Email</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client) => (
              <tr
                key={client.id}
                onClick={() => navigate(`/client/${client.id}`)}
                className="group cursor-pointer hover:bg-gradient-to-r hover:from-pink-50 hover:to-violet-50 transition-colors"
              >
                <td className="px-6 py-4 border-t border-pink-100">
                  <div className="flex items-center gap-2">
                    {client.firstName}
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-pink-500" />
                  </div>
                </td>
                <td className="px-6 py-4 border-t border-pink-100">{client.lastName}</td>
                <td className="px-6 py-4 border-t border-pink-100">{client.email}</td>
              </tr>
            ))}
            {filteredClients.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-gray-500 border-t border-pink-100">
                  ✨ No clients found. Let's add some! ✨
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <button
        onClick={() => navigate("/new-client")}
        className="mt-6 px-6 py-3 bg-gradient-to-r from-pink-500 to-violet-500 text-white rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity"
      >
        <UserPlus className="w-5 h-5" />
        Add New Client
      </button>
    </div>
  );
};

export default Clients;