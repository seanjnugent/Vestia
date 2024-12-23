import React, { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useNavigate } from "react-router-dom";
import {
    PlusCircle,
    CreditCard,
    TrendingUp,
    ArrowUpRight,
    Coins,
    PiggyBank,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { BeatLoader } from 'react-spinners';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const Home = () => {
    const navigate = useNavigate();
    const [clientData, setClientData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClientData = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (!userId) {
                    throw new Error('No user ID found');
                }

                const response = await fetch(`http://localhost:5000/api/clients/client-performance/${userId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch client data');
                }

                const data = await response.json();
                setClientData(data[0]);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching client data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchClientData();
    }, []);

    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [
            {
                label: 'Portfolio Value (£)',
                data: [2000, 2200, 2300, 2400, 2450, 2500, clientData?.total_client_value || 2540],
                borderColor: '#38d6b7',
                backgroundColor: 'rgba(56, 214, 183, 0.2)',
                tension: 0.4,
                fill: 'start',
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                padding: 10,
                cornerRadius: 5,
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
            },
            y: {
                grid: {
                    borderDash: [5, 5],
                    color: 'rgba(0,0,0,0.05)',
                },
            },
        },
    };

    const ActionButton = ({ icon: Icon, title, description, onClick }) => (
        <motion.button
            whileHover={{ scale: 1.05, backgroundColor: '#c2f2ea' }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className="flex items-center p-5 rounded-2xl bg-white shadow-md transition-all duration-300 group border border-gray-100 w-full max-w-full"
            style={{ border: '1px solid #38d6b7' }}
        >
            <Icon className="text-[#38d6b7] w-7 h-7 mr-4 group-hover:rotate-12 transition-transform" />
            <div className="flex-grow text-left">
                <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                <p className="text-sm text-gray-500 mt-1">{description}</p>
            </div>
            <ArrowUpRight className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5" />
        </motion.button>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-teal-50 to-white">
                <BeatLoader color="#38d6b7" size={15} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-red-500 text-xl">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white font-sans">
            <div className="max-w-7xl mx-auto py-12 px-6 lg:px-8 space-y-12">
                <div className="md:flex md:items-center md:justify-between">
                    <div>
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">

                            Welcome, {clientData?.first_name || 'User'}
                        </h1>
                        <p className="mt-1 text-xl text-gray-600">Your investment overview</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8 border border-[#38d6b7]"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                    <TrendingUp className="text-[#38d6b7] w-6 h-6" />
                                    Portfolio Performance
                                </h2>
                                <p className="text-4xl font-bold text-gray-900 mt-2 tracking-tight">
                                    £{Number(clientData?.total_client_value || 0).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </p>
                            </div>
                            <div className={`text-sm ${Number(clientData?.total_return_percentage) >= 0 ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'} px-3 py-1 rounded-full font-medium`}>
                                {Number(clientData?.total_return_percentage) >= 0 ? '+' : ''}{Number(clientData?.total_return_percentage).toFixed(2)}% this month
                            </div>
                        </div>
                        <div className="h-72 relative">
                            <Line data={data} options={options} />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-6"
                    >
                        <ActionButton
                            icon={Coins}
                            title="New Trade"
                            description="Buy or sell an asset"
                            onClick={() => navigate("/new-trade")}
                        />
                        <ActionButton
                            icon={PiggyBank}
                            title="New Payment"
                            description="Deposit or withdraw funds"
                            onClick={() => navigate("/new-payment")}
                        />
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Home;
