import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    Home,
    LogOut,
    User,
    Menu,
    Bell
} from 'lucide-react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

const TopNav = () => {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [notifications] = useState([
        {
            id: 1,
            message: "You just bought 100 shares of AAPL",
            time: "2 minutes ago"
        },
        {
            id: 2,
            message: "Your account statement is ready",
            time: "1 hour ago"
        }
    ]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate("/login");
    };

    return (
        <div className="w-full bg-gradient-to-r from-[#007D9A] to-[#2dd4bf] text-white py-4 relative shadow-md">
            <div className="absolute inset-0 bg-white bg-opacity-10 backdrop-filter backdrop-blur-md z-0"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white opacity-20 transform skew-y-6 z-0"></div>
            <div className="container mx-auto px-6 flex md:items-center md:justify-between relative z-10">
                <div className="flex justify-between items-center w-full md:w-auto">
                    <NavLink to="/home" className="flex items-center gap-2">
                        <img src="/vestia-logo.png" alt="Vestia Logo" className="h-10 w-10" />
                        <h2 className="text-xl font-bold">Vestia</h2>
                    </NavLink>
                    <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        <Menu size={24} />
                    </button>
                </div>

                <nav className={`md:block ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
                    <ul className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-3 mt-2 md:mt-0">
                        <li>
                            <NavLink to="/home" className={({ isActive }) =>
                                `px-3 py-1 rounded transition duration-300 ${
                                    isActive
                                        ? 'bg-white/20 backdrop-blur-sm'
                                        : 'hover:bg-white/10 hover:backdrop-blur-sm'
                                }`
                            }>
                                <Home size={18} className="inline mr-1 -mt-1" />
                                <span>Dashboard</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/accounts" className={({ isActive }) =>
                                `px-3 py-1 rounded transition duration-300 ${
                                    isActive
                                        ? 'bg-white/20 backdrop-blur-sm'
                                        : 'hover:bg-white/10 hover:backdrop-blur-sm'
                                }`
                            }>
                                <span>Accounts</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/research" className={({ isActive }) =>
                                `px-3 py-1 rounded transition duration-300 ${
                                    isActive
                                        ? 'bg-white/20 backdrop-blur-sm'
                                        : 'hover:bg-white/10 hover:backdrop-blur-sm'
                                }`
                            }>
                                <span>Research</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/trades" className={({ isActive }) =>
                                `px-3 py-1 rounded transition duration-300 ${
                                    isActive
                                        ? 'bg-white/20 backdrop-blur-sm'
                                        : 'hover:bg-white/10 hover:backdrop-blur-sm'
                                }`
                            }>
                                <span>Trades</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/payments" className={({ isActive }) =>
                                `px-3 py-1 rounded transition duration-300 ${
                                    isActive
                                        ? 'bg-white/20 backdrop-blur-sm'
                                        : 'hover:bg-white/10 hover:backdrop-blur-sm'
                                }`
                            }>
                                <span>Payments</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/documents" className={({ isActive }) =>
                                `px-3 py-1 rounded transition duration-300 ${
                                    isActive
                                        ? 'bg-white/20 backdrop-blur-sm'
                                        : 'hover:bg-white/10 hover:backdrop-blur-sm'
                                }`
                            }>
                                <span>Documents</span>
                            </NavLink>
                        </li>
                    </ul>
                </nav>

                <div className="flex items-center space-x-4 text-base md:flex hidden">
                    <Popover>
                        <PopoverTrigger>
                            <div className="px-3 py-1 rounded transition duration-300 hover:bg-white/10 hover:backdrop-blur-sm cursor-pointer">
                                <Bell size={18} className="inline mr-1 -mt-1" />
                                <span>Notifications</span>
                            </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-0">
                            <div className="bg-white rounded-xl shadow-lg">
                                <div className="p-4 border-b">
                                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    {notifications.map(notification => (
                                        <div key={notification.id} className="p-4 hover:bg-gray-50 border-b cursor-pointer">
                                            <p className="text-sm text-gray-800">{notification.message}</p>
                                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>

                    <NavLink to="/profile" className="px-3 py-1 rounded transition duration-300 hover:bg-white/10 hover:backdrop-blur-sm">
                        <User size={18} className="inline mr-1 -mt-1" />
                        <span>Profile</span>
                    </NavLink>

                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 rounded-xl transition duration-300 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white"
                    >
                        <LogOut size={18} className="inline mr-1 -mt-1" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TopNav;
