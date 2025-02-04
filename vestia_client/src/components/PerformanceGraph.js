import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-moment';
import moment from 'moment';
import { TrendingUp } from 'lucide-react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/solid';

ChartJS.register(...registerables);

const DEFAULT_DAYS = 7;

const PerformanceGraph = ({ portfolioHistory, title = 'Performance', liveData }) => {
    const [dateRange, setDateRange] = useState(DEFAULT_DAYS);
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        if (!portfolioHistory || portfolioHistory.length === 0) {
            setFilteredData([]);
            return;
        }

        const processedData = portfolioHistory.map(item => ({
            ...item,
            performance_date: moment(item.performance_date).startOf('day'),
            total_asset_value: parseFloat(item.total_asset_value) || 0,
            cash_balance: parseFloat(item.cash_balance) || 0,
        }));

        const sortedData = processedData.sort((a, b) =>
            a.performance_date.valueOf() - b.performance_date.valueOf()
        );

        const cutoffDate = moment().subtract(dateRange, 'days').startOf('day');
        let filtered = sortedData.filter(item =>
            item.performance_date.isAfter(cutoffDate)
        );

        // Overwrite the current date's value with live data if available
        if (liveData) {
            const currentDate = moment().startOf('day');
            const existingEntryIndex = filtered.findIndex(item =>
                item.performance_date.isSame(currentDate)
            );

            if (existingEntryIndex !== -1) {
                filtered[existingEntryIndex] = {
                    performance_date: currentDate,
                    total_asset_value: parseFloat(liveData.total_asset_value || liveData.total_asset_balance) || 0,
                    cash_balance: parseFloat(liveData.cash_balance || liveData.total_cash_value) || 0,
                };
            } else {
                filtered.push({
                    performance_date: currentDate,
                    total_asset_value: parseFloat(liveData.total_asset_value || liveData.total_asset_balance) || 0,
                    cash_balance: parseFloat(liveData.cash_balance || liveData.total_cash_value) || 0,
                });
            }
        }

        setFilteredData(filtered);
    }, [dateRange, portfolioHistory, liveData]);

    const formatDateRange = (days) => {
        if (days < 7) return `${days} days`;
        if (days === 7) return `1 week`;
        if (days < 30) return `${Math.round(days/7)} weeks`;
        if (days < 365) return `${Math.round(days/30)} months`;
        return '1 year';
    };

    // Calculate total value and return percentage
    const totalValue = filteredData.length > 0
        ? filteredData[filteredData.length - 1].total_asset_value + filteredData[filteredData.length - 1].cash_balance
        : 0;

    const totalReturn = filteredData.length > 1
        ? ((totalValue - (filteredData[0].total_asset_value + filteredData[0].cash_balance)) /
           (filteredData[0].total_asset_value + filteredData[0].cash_balance)) * 100
        : 0;

        const calculateYAxisRange = (data) => {
            if (data.length === 0) return { min: 0, max: 100 }; // Default range if no data
        
            const values = data.map(item => item.total_asset_value + item.cash_balance);
            const minValue = Math.min(...values);
            const maxValue = Math.max(...values);
        
            // Add a 5% buffer
            const buffer = (maxValue - minValue) * 0.10;
            const min = minValue - buffer;
            const max = maxValue + buffer;
        
            return { min, max };
        };
        
        const { min, max } = calculateYAxisRange(filteredData);
        
        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day',
                        displayFormats: {
                            day: 'MMM D',
                        },
                        tooltipFormat: 'MMM D, YYYY',
                    },
                    ticks: {
                        maxTicksLimit: 6,
                        autoSkip: true,
                        color: '#94a3b8',
                        font: {
                            family: '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto',
                            size: 12
                        }
                    },
                    grid: {
                        display: false,
                    },
                },
                y: {
                    min: min, // Set the calculated min value
                    max: max, // Set the calculated max value
                    ticks: {
                        color: '#94a3b8',
                        font: {
                            family: '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto',
                            size: 12
                        },
                        callback: function(value) {
                            return '£' + value.toLocaleString();
                        },
                        count: 5
                    },
                    grid: {
                        color: 'rgba(148, 163, 184, 0.1)',
                        drawBorder: false,
                    },
                },
            },
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    titleColor: '#7c3aed',
                    bodyColor: '#374151',
                    borderColor: '#e2e8f0',
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 12,
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    callbacks: {
                        title: function(context) {
                            return moment(context[0].raw.x).format('ddd, MMM D, YYYY');
                        },
                        label: function(context) {
                            return `£${context.raw.y.toLocaleString()}`;
                        },
                    },
                },
            },
            interaction: {
                intersect: false,
                mode: 'index',
            },
        };

    const chartData = {
        datasets: [
            {
                label: 'Total Portfolio',
                data: filteredData.map(item => ({
                    x: item.performance_date.toDate(),
                    y: item.total_asset_value + item.cash_balance,
                })),
                borderColor: '#7c3aed',
                backgroundColor: 'rgba(124, 58, 237, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: '#7c3aed',
                pointHoverBorderColor: '#ffffff',
                pointHoverBorderWidth: 2,
            },
        ],
    };

    // If no data, show placeholder
    if (!portfolioHistory || portfolioHistory.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-lg p-8 relative min-h-[400px]">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                            <TrendingUp className="text-[#7c3aed] w-6 h-6" />
                            {title}
                        </h2>
                    </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-xl text-gray-500 mb-2">No performance data to show</p>
                        <p className="text-sm text-gray-400">Start trading to see your portfolio performance</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg p-8 relative">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                        <TrendingUp className="text-[#7c3aed] w-6 h-6" />
                        {title}
                    </h2>
                    <p className="text-4xl font-bold text-gray-900 mt-2 tracking-tight">
                        £{totalValue.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                </div>
                <div className="text-right">
                    <p className={`text-2xl font-bold ${totalReturn >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {totalReturn >= 0 ? '+' : ''}{totalReturn.toFixed(2)}%
                    </p>
                    <p className="text-sm text-gray-600">Total Return</p>
                </div>
            </div>

            <div className="h-72 relative mb-6">
                <Line data={chartData} options={chartOptions} />
            </div>

            <div className="absolute bottom-4 right-4">
                <Menu as="div" className="relative inline-block text-left">
                    <Menu.Button className="inline-flex justify-center w-full rounded-xl border border-gray-200 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7c3aed]">
                        {formatDateRange(dateRange)}
                        <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
                    </Menu.Button>

                    <Transition
                        as={React.Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items className="origin-bottom-right absolute right-0 bottom-full mb-2 w-56 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="py-1">
                                {[
                                    { label: '1 Week', days: 7 },
                                    { label: '1 Month', days: 30 },
                                    { label: '3 Months', days: 90 },
                                    { label: '6 Months', days: 180 },
                                    { label: '1 Year', days: 365 }
                                ].map((option) => (
                                    <Menu.Item key={option.days}>
                                        {({ active }) => (
                                            <button
                                                className={`${
                                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                                } block w-full text-left px-4 py-2 text-sm`}
                                                onClick={() => setDateRange(option.days)}
                                            >
                                                {option.label}
                                            </button>
                                        )}
                                    </Menu.Item>
                                ))}
                            </div>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>
        </div>
    );
};

export default PerformanceGraph;
