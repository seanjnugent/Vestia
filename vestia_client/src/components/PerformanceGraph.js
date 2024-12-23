import React from 'react';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-moment';
import moment from 'moment';
import { TrendingUp } from 'lucide-react';

ChartJS.register(...registerables);

const PerformanceGraph = ({ portfolioHistory }) => {
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'day',
                    displayFormats: {
                        day: 'MMM DD'
                    }
                },
                ticks: {
                    maxTicksLimit: 7,
                    autoSkip: true,
                    color: '#6b7280', // Neutral gray
                },
                grid: {
                    display: false
                }
            },
            y: {
                beginAtZero: false,
                ticks: {
                    color: '#6b7280', // Neutral gray
                },
                grid: {
                    display: false
                }
            }
        },
        elements: {
            line: {
                tension: 0.3, // Smoothness
                borderWidth: 2 // Sleek line thickness
            },
            point: {
                radius: 0 // Clean lines without points
            }
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                enabled: true,
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                titleColor: '#111827', // Dark gray
                bodyColor: '#111827',
                borderColor: '#38d6b7', // Teal
                borderWidth: 1,
                padding: 10,
                callbacks: {
                    title: function (context) {
                        return moment(context[0].label).format('ddd, MMM DD');
                    },
                    label: function (context) {
                        const value = parseFloat(context.raw.y); // Ensure valid number
                        return `£${value.toLocaleString()}`;
                    }
                }
            }
        }
    };

    const chartData = {
        datasets: [
            {
                label: 'Portfolio Value',
                data: portfolioHistory.map(item => ({ x: item.date, y: item.value })),
                borderColor: '#38d6b7', // Teal stroke
                backgroundColor: 'rgba(56, 214, 183, 0.1)', // Teal fill with transparency
                fill: true,
            }
        ]
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-teal-500" />
                <h2 className="text-xl font-semibold text-gray-800">Performance</h2>
            </div>
            <div className="h-64 relative" key={portfolioHistory.length}>
                <Line data={chartData} options={chartOptions} />
            </div>
        </div>
    );
};

export default PerformanceGraph;
