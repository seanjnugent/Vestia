import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
    Home, 
    LogOut, 
    User, 
    Menu
} from 'lucide-react';

const TopNav = () => {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate("/login");
    };

    return (
        <div className="w-full bg-gradient-to-r from-[#00836f] to-[#38d6c7] text-white shadow-md py-2 md:py-6"> {/* Adjusted padding for mobile */}
            <div className="container mx-auto px-6 flex md:items-center md:justify-between"> {/* Flex only on medium screens and up */}
                <div className="flex justify-between items-center w-full md:w-auto">
                    <NavLink to="/home" className="flex items-center gap-2">
                        <img src="/vestia-logo.png" alt="Vestia Logo" className="h-10 w-10" /> {/* Adjust size of logo */}
                        <h2 className="text-xl font-bold">Vestia</h2>
                    </NavLink>
                    <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        <Menu size={24} />
                    </button>
                </div>

                <nav className={`md:block ${isMobileMenuOpen ? 'block' : 'hidden'}`}> {/* Conditionally show/hide nav */}
                    <ul className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-3 mt-2 md:mt-0">
                        <li>
                            <NavLink to="/home" className={({ isActive }) => `px-3 py-1 rounded transition ${isActive ? 'bg-white text-black' : 'hover:bg-white/20'}`}>
                                <Home size={18} className="inline mr-1 -mt-1" />
                                <span>Dashboard</span>
                            </NavLink>
                        </li>
                         <li>
                            <NavLink to="/accounts" className="px-3 py-1 rounded hover:bg-white/20 transition">
                                <span>Accounts</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/research" className="px-3 py-1 rounded hover:bg-white/20 transition">
                                <span>Research</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/trades" className="px-3 py-1 rounded hover:bg-white/20 transition">
                                <span>Trades</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/payments" className="px-3 py-1 rounded hover:bg-white/20 transition">
                                <span>Payments</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/documents" className="px-3 py-1 rounded hover:bg-white/20 transition">
                                <span>Documents</span>
                            </NavLink>
                        </li>
                        <li className="md:hidden"> {/* Only show on mobile */}
                          <NavLink to="/profile" className="px-3 py-1 rounded hover:bg-white/20 transition block w-full text-left">
                              <User size={18} className="inline mr-1 -mt-1" />
                              <span>Profile</span>
                          </NavLink>
                      </li>
                      <li className="md:hidden">
                        <button onClick={handleLogout} className="px-3 py-1 rounded transition bg-[#00836f] hover:bg-[#2dab92] text-white block w-full text-left">
                            <LogOut size={18} className="inline mr-1 -mt-1" />
                            <span>Logout</span>
                        </button>
                    </li>
                    </ul>
                </nav>
                <div className="flex items-center space-x-4 text-base md:flex hidden"> {/* Hide on mobile, flex on medium screens and up */}
                    <NavLink to="/profile" className="px-3 py-1 rounded hover:bg-white/20 transition">
                        <User size={18} className="inline mr-1 -mt-1" />
                        <span>Profile</span>
                    </NavLink>
                    <button onClick={handleLogout} className="px-3 py-1 rounded transition bg-[#2dab92] hover:bg-[#279680] text-white">
                        <LogOut size={18} className="inline mr-1 -mt-1" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TopNav;