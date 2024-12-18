import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Wallet, 
  TrendingUp, 
  CreditCard, 
  LogOut, 
  User, 
  BarChart2,
  FileText, 
  CalendarSync
} from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="h-screen w-64 bg-gradient-to-br from-blue-600 to-blue-800 text-white flex flex-col p-4 shadow-lg">
      <h2 className="text-2xl font-bold mb-6">My App</h2>
      <nav className="flex-1">
        <ul className="space-y-4">
          <li>
            <NavLink 
              to="/home" 
              className={({ isActive }) => 
                `flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                  isActive ? 'bg-blue-700' : 'hover:bg-blue-500'
                }`
              }
            >
              <Home /> Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/accounts" 
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-500 transition-all duration-300"
            >
              <Wallet /> Accounts
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/research" 
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-500 transition-all duration-300"
            >
              <BarChart2 /> Research
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/trades" 
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-500 transition-all duration-300"
            >
              <TrendingUp /> Trades
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/payments" 
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-500 transition-all duration-300"
            >
              <CreditCard /> Payments
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/regular-payments" 
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-500 transition-all duration-300"
            >
              <CalendarSync /> Regular Payments
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/documents" 
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-500 transition-all duration-300"
            >
              <FileText /> Documents
            </NavLink>
          </li>
        </ul>
      </nav>
      <div>
        <NavLink 
          to="/profile" 
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-500 transition-all duration-300"
        >
          <User /> Profile
        </NavLink>
        <NavLink 
          to="/logout" 
          className="flex items-center gap-3 p-3 mt-4 rounded-lg hover:bg-red-500 transition-all duration-300"
        >
          <LogOut /> Logout
        </NavLink>
      </div>
    </div>
  );
};


export default Sidebar;
