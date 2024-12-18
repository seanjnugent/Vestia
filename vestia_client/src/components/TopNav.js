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

const TopNav = () => {
  return (
    <div className="w-full bg-gradient-to-r from-[#ff6b6b] via-[#ffa500] to-[#ffff00] text-white shadow-md py-4"> {/* Gradient background and increased padding */}
      <div className="container mx-auto flex items-center justify-between px-4"> {/* Added container for centering */}
        {/* Brand Name */}
        <h2 className="text-xl font-bold">My App</h2> {/* Increased font size */}

        {/* Navigation */}
        <nav>
          <ul className="flex items-center space-x-6 text-base"> {/* Increased spacing and font size */}
            <li>
              <NavLink 
                to="/home" 
                className={({ isActive }) => 
                  `px-3 py-1 rounded transition ${
                    isActive ? 'bg-white text-black' : 'hover:bg-white/20' // White background on active, lighter hover
                  }`
                }
              >
                <Home size={18} className="inline mr-1 -mt-1" /> {/* Inline icon and margin adjustment */}
                <span>Dashboard</span> {/* Added span for consistent spacing */}
              </NavLink>
            </li>
            {/* ... (Rest of the NavLinks with similar styling) */}
            <li>
              <NavLink 
                to="/accounts" 
                className="px-3 py-1 rounded hover:bg-white/20 transition"
              >
                <Wallet size={18} className="inline mr-1 -mt-1" />
                <span>Accounts</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/research" 
                className="px-3 py-1 rounded hover:bg-white/20 transition"
              >
                <BarChart2 size={18} className="inline mr-1 -mt-1" /> 
                <span>Research</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/trades" 
                className="px-3 py-1 rounded hover:bg-white/20 transition"
              >
                <TrendingUp size={18} className="inline mr-1 -mt-1" />
                <span>Trades</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/payments" 
                className="px-3 py-1 rounded hover:bg-white/20 transition"
              >
                <CreditCard size={18} className="inline mr-1 -mt-1" />
                <span>Payments</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/regular-payments" 
                className="px-3 py-1 rounded hover:bg-white/20 transition"
              >
                <CalendarSync size={18} className="inline mr-1 -mt-1" />
                <span>Regular</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/documents" 
                className="px-3 py-1 rounded hover:bg-white/20 transition"
              >
                <FileText size={18} className="inline mr-1 -mt-1" />
                <span>Docs</span>
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Profile & Logout */}
        <div className="flex items-center space-x-4 text-base"> {/* Increased spacing and font size */}
           <NavLink 
            to="/profile" 
            className="px-3 py-1 rounded hover:bg-white/20 transition"
          >
            <User size={18} className="inline mr-1 -mt-1" />
            <span>Profile</span>
          </NavLink>
          <NavLink 
            to="/logout" 
            className="px-3 py-1 rounded hover:bg-white/20 transition" // Removed red hover
          >
            <LogOut size={18} className="inline mr-1 -mt-1" />
            <span>Logout</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default TopNav;