import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Wallet,
  BarChart2,
  PieChart,
  CreditCard,
  LogOut,
  User,
  FileText,
  CalendarSync,
  Menu,
} from 'lucide-react';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Automatically collapse the sidebar on narrow screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    // Initial check
    handleResize();

    // Add event listener for resizing
    window.addEventListener('resize', handleResize);

    // Clean up event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`h-screen ${
          isCollapsed ? 'w-16' : 'w-64'
        } bg-gradient-to-br from-blue-600 to-blue-800 text-white flex flex-col p-4 shadow-lg transition-all duration-300 fixed left-0 top-0 z-50`}
      >
        {/* Hamburger Menu */}
        <button
          className="text-white mb-6 focus:outline-none"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <Menu />
        </button>

        <div className="flex items-center mb-6">
          {!isCollapsed && (
            <img src="/vestia-logo.png" alt="Vestia Logo" className="h-10 w-10 mr-2" />
          )}
          {!isCollapsed && <h2 className="text-2xl font-bold">Vestia Admin</h2>}
        </div>

        <nav className="flex-1 overflow-y-auto">
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
                <Home /> {!isCollapsed && 'Dashboard'}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/clients"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-500 transition-all duration-300"
              >
                <Wallet /> {!isCollapsed && 'Clients'}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/research"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-500 transition-all duration-300"
              >
                <BarChart2 /> {!isCollapsed && 'Funds'}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/managed-portfolios"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-500 transition-all duration-300"
              >
                <PieChart /> {!isCollapsed && 'Managed Portfolios'}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/payments"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-500 transition-all duration-300"
              >
                <CreditCard /> {!isCollapsed && 'Payments'}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/regular-payments"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-500 transition-all duration-300"
              >
                <CalendarSync /> {!isCollapsed && 'Regular Payments'}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/documents"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-500 transition-all duration-300"
              >
                <FileText /> {!isCollapsed && 'Reports'}
              </NavLink>
            </li>
          </ul>
        </nav>

        <div>
          <NavLink
            to="/profile"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-500 transition-all duration-300"
          >
            <User /> {!isCollapsed && 'Profile'}
          </NavLink>
          <NavLink
            to="/logout"
            className="flex items-center gap-3 p-3 mt-4 rounded-lg hover:bg-red-500 transition-all duration-300"
          >
            <LogOut /> {!isCollapsed && 'Logout'}
          </NavLink>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 pl-72 overflow-y-auto">
        {/* Your main content goes here */}
      </main>
    </div>
  );
};

export default Sidebar;
