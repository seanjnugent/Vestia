import React from 'react';
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

    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [
            {
                label: 'Portfolio Value (£)',
                data: [2000, 2200, 2300, 2400, 2450, 2500, 2540],
                borderColor: '#FF6B6B',
                backgroundColor: 'rgba(255, 107, 107, 0.3)',
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
            whileHover={{ scale: 1.05, backgroundColor: '#FFF7E6' }} // Soft yellow hover
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className="flex items-center p-5 rounded-2xl bg-white shadow-md transition-all duration-300 group border border-gray-100 w-full max-w-full"
            style={{ border: '1px solid #FFA500' }} // Orange border
        >
            <Icon className="text-orange-500 w-7 h-7 mr-4 group-hover:rotate-12 transition-transform" />
            <div className="flex-grow text-left">
                <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                <p className="text-sm text-gray-500 mt-1">{description}</p>
            </div>
            <ArrowUpRight className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5" />
        </motion.button>
    );

    return (
        <div
            className="min-h-screen bg-gradient-to-r from-[#ff6b6b] via-[#ffa500] to-[#ffff00] font-system"
            style={{
                backgroundImage: 'url("https://i.pinimg.com/originals/39/3a/0b/393a0b36879e951594918e986064972f.gif")',
                backgroundSize: 'cover',
            }}
        >
            <div className="max-w-7xl mx-auto py-12 px-6 lg:px-8 space-y-12">
                <div className="md:flex md:items-center md:justify-between">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 drop-shadow-lg">
                            Welcome, James
                        </h1>
                        <p className="mt-1 text-xl text-gray-600">Your investment overview</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8 border border-yellow-200"
                        style={{ backdropFilter: 'blur(5px)' }}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                    <TrendingUp className="text-yellow-500 w-6 h-6" />
                                    Portfolio Performance
                                </h2>
                                <p className="text-4xl font-bold text-gray-900 mt-2 tracking-tight">
                                    £2,540
                                </p>
                            </div>
                            <div className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full font-medium">
                                +12.5% this month
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
