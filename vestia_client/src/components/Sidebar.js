import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 bg-white shadow-md h-full">
      <nav className="flex flex-col p-4">
        <Link to="/home" className="mb-2 text-gray-700 hover:text-blue-500">
          Home
        </Link>
        <Link to="/accounts" className="mb-2 text-gray-700 hover:text-blue-500">
          Accounts
        </Link>
        <Link to="/research" className="mb-2 text-gray-700 hover:text-blue-500">
          Research
        </Link>
        <Link to="/payments" className="mb-2 text-gray-700 hover:text-blue-500">
          Payments
        </Link>
        <Link to="/trades" className="mb-2 text-gray-700 hover:text-blue-500">
          Trades
        </Link>
        <Link to="/documents" className="mb-2 text-gray-700 hover:text-blue-500">
          Documents
        </Link>
        <Link to="/profile" className="mb-2 text-gray-700 hover:text-blue-500">
          Profile
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
