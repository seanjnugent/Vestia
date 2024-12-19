import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ChevronRight, Calendar, Clock, TrendingUp, TrendingDown } from 'react-feather'; // More relevant icons
import { format, parseISO } from 'date-fns'; // For date formatting

const RegularPayments = () => {
    const [depositData, setDepositData] = useState([
        {
            id: 1,
            frequency: "Monthly",
            nextDate: "2024-12-25",
            amount: "$1000",
            account: "Personal Account", // New column
            details: [
                { asset: "Tesla", amount: "$200" },
                { asset: "Google", amount: "$600" },
                { asset: "AAPL", amount: "$200" },
            ],
        },
        {
            id: 2,
            frequency: "Weekly",
            nextDate: "2024-12-22",
            amount: "$500",
            account: "Savings Account", // New column
            details: [
                { asset: "Tesla", amount: "$150" },
                { asset: "AAPL", amount: "$350" },
            ],
        },
    ]);

    const [withdrawalData, setWithdrawalData] = useState([
        {
            id: 1,
            frequency: "Monthly",
            nextDate: "2024-12-25",
            percentage: "5%",
        },
        {
            id: 2,
            frequency: "Quarterly",
            nextDate: "2025-01-01",
            percentage: "10%",
        },
    ]);

    const formatDate = (dateString) => {
        try {
            const parsedDate = parseISO(dateString);
            return format(parsedDate, 'dd MMM yyyy'); // e.g., 25 Dec 2024
        } catch (error) {
            console.error("Error parsing date:", error);
            return "Invalid Date";
        }
    };

    const formatCurrency = (amount) => {
        try {
            const num = Number(amount.replace(/[^0-9.-]+/g, ""));
            return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(num);
        } catch (error) {
            return amount;
        }
    }

    return (
        <div className="bg-gray-100 min-h-screen p-8"> {/* Full-screen background */}
            <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden"> {/* Larger container with rounded corners and shadow */}
                <div className="px-8 py-10"> {/* Increased padding */}
                    <h1 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">Regular Payments</h1> {/* Refined heading */}

                    {/* Deposit Section */}
                    <section className="mb-12"> {/* Added margin bottom */}
                        <div className="flex items-center justify-between mb-4"> {/* Flexbox for layout */}
                            <h2 className="text-xl font-semibold text-gray-900 tracking-tight">Regular Deposits</h2>
                            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center space-x-2 transition duration-200">
                                <Plus size={18} /> <span>New Deposit</span>
                            </button>
                        </div>
                        <p className="text-gray-600 text-sm mb-6">Automatically invest in your chosen funds or cash balance.</p>

                        {depositData.length === 0 ? (
                            <div className="text-center text-gray-500 py-8">No regular deposits set up yet.</div>
                        ) : (
                            <div className="overflow-x-auto"> {/* Horizontal scroll if needed */}
                                <table className="min-w-full divide-y divide-gray-200"> {/* Improved table styling */}
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Payment</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th> {/* New column */}
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                            <th scope="col" className="relative px-6 py-3">
                                                <span className="sr-only">View</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {depositData.map((deposit) => (
                                            <tr key={deposit.id} className="hover:bg-gray-50 transition duration-150">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex items-center"><Clock size={16} className="mr-2 text-gray-400"/> {deposit.frequency}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex items-center"><Calendar size={16} className="mr-2 text-gray-400"/>{formatDate(deposit.nextDate)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{deposit.account}</td> {/* New column */}
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(deposit.amount)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <Link to={`/payment-details/${deposit.id}`} className="text-blue-600 hover:text-blue-800 flex items-center">
                                                        <span>View Details</span> <ChevronRight size={16} />
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>

                    {/* Withdrawal Section (Similar structure to Deposits) */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-900 tracking-tight">Regular Withdrawals</h2>
                            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center space-x-2 transition duration-200">
                                <Plus size={18} /> <span>New Withdrawal</span>
                            </button>
                        </div>
                        <p className="text-gray-600 text-sm mb-6">Automatically withdraw a percentage or fixed amount from your holdings.</p>
                        {withdrawalData.length === 0 ? (
                            <div className="text-center text-gray-500 py-8">No regular withdrawals set up yet.</div>
                        ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Withdrawal</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                                        <th scope="col" className="relative px-6 py-3">
                                            <span className="sr-only">View</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {withdrawalData.map((withdrawal) => (
                                        <tr key={withdrawal.id} className="hover:bg-gray-50 transition duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex items-center"><Clock size={16} className="mr-2 text-gray-400"/>{withdrawal.frequency}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex items-center"><Calendar size={16} className="mr-2 text-gray-400"/>{formatDate(withdrawal.nextDate)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{withdrawal.percentage}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Link to={`/withdrawal-details/${withdrawal.id}`} className="text-blue-600 hover:text-blue-800 flex items-center">
                                                    <span>View Details</span> <ChevronRight size={16} />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
};

export default RegularPayments;
