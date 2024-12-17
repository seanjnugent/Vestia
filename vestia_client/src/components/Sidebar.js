import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  CreditCard, 
  BarChart2, 
  ChevronsLeft, 
  ChevronsRight, 
  User, 
  FileText, 
  CalendarSync,
  DollarSign,
  Trello 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    { 
      path: "/home", 
      icon: Home, 
      label: "Home" 
    },
    { 
      path: "/accounts", 
      icon: CreditCard, 
      label: "Accounts" 
    },
    { 
      path: "/research", 
      icon: BarChart2, 
      label: "Research" 
    },
    { 
      path: "/payments", 
      icon: DollarSign, 
      label: "Payments" 
    },
    { 
      path: "/regular-payments", 
      icon: CalendarSync, 
      label: "Regular Payments" 
    },
    { 
      path: "/trades", 
      icon: Trello, 
      label: "Trades" 
    },
    { 
      path: "/documents", 
      icon: FileText, 
      label: "Documents" 
    },
    { 
      path: "/profile", 
      icon: User, 
      label: "Profile" 
    }
  ];

  return (
    <motion.div 
      initial={{ width: 250 }}
      animate={{ 
        width: isCollapsed ? 80 : 250,
        transition: { duration: 0.3 }
      }}
      className="bg-white border-r border-gray-100 h-screen flex flex-col shadow-lg"
    >
      <div className="p-4 flex justify-between items-center">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.h2 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-2xl font-bold text-blue-600"
            >
              Vestia
            </motion.h2>
          )}
        </AnimatePresence>
        
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-gray-500 hover:text-blue-600 transition-colors"
        >
          {isCollapsed ? <ChevronsRight /> : <ChevronsLeft />}
        </button>
      </div>

      <nav className="flex-grow overflow-y-auto px-4 pt-4 space-y-2">
        {menuItems.map((item) => (
          <Link 
            key={item.path}
            to={item.path}
            className={`
              flex items-center p-3 rounded-lg transition-all duration-300 
              ${location.pathname === item.path 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'}
            `}
          >
            <item.icon 
              className={`mr-3 ${
                location.pathname === item.path 
                  ? 'text-blue-600' 
                  : 'text-gray-400 group-hover:text-blue-600'
              }`} 
            />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="font-medium"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs text-gray-400 text-center"
            >
              © 2024 Vestia
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Sidebar;