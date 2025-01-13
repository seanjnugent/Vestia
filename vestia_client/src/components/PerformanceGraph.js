import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-moment';
import moment from 'moment';
import { TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/solid';

ChartJS.register(...registerables);

const DEFAULT_DAYS = 7;

const PerformanceGraph = ({ portfolioHistory, title = 'Performance' }) => {
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
    const filtered = sortedData.filter(item =>
      item.performance_date.isAfter(cutoffDate)
    );

    setFilteredData(filtered);
  }, [dateRange, portfolioHistory]);

  const formatDateRange = (days) => {
    if (days < 7) return `${days} days`;
    if (days = 7) return `${Math.round(days/7)} week`;
    if (days < 30) return `${Math.round(days/7)} weeks`;
    if (days < 365) return `${Math.round(days/30)} months`;
    return '1 year';
  };

  const totalValue = filteredData.length > 0
    ? filteredData[filteredData.length - 1].total_asset_value + filteredData[filteredData.length - 1].cash_balance
    : 0;

  const totalReturn = filteredData.length > 1
    ? ((totalValue - (filteredData[0].total_asset_value + filteredData[0].cash_balance)) / (filteredData[0].total_asset_value + filteredData[0].cash_balance)) * 100
    : 0;

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
        min: 0,
        suggestedMax: undefined,
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
        afterDataLimits: (scale) => {
          // Find the maximum value in the dataset
          const maxValue = Math.max(...filteredData.map(item => 
            item.total_asset_value + item.cash_balance
          ));
          
          // If all values are the same or very close
          const minValue = Math.min(...filteredData.map(item => 
            item.total_asset_value + item.cash_balance
          ));
          
          if (maxValue === minValue || (maxValue - minValue) / maxValue < 0.01) {
            // Set the scale to show ±25% of the value
            scale.max = maxValue * 1.25;
            scale.min = Math.max(0, maxValue * 0.75); // Ensure we don't go below 0
          }
        }
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#0f172a',
        bodyColor: '#0f172a',
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
        borderColor: '#38d6b7',
        backgroundColor: 'rgba(56, 214, 183, 0.08)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#38d6b7',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 2,
      },
    ],
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 relative">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <TrendingUp className="text-[#38d6b7] w-6 h-6" />
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
        {filteredData.length > 0 ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No data available for the selected period
          </div>
        )}
      </div>

      <div className="absolute bottom-4 right-4">
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
              {formatDateRange(dateRange)}
              <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
            </Menu.Button>
          </div>

          <Transition
            as={React.Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
           <Menu.Items className="origin-bottom-right absolute right-0 bottom-full mb-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
  <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} block w-full text-left px-4 py-2 text-sm`}
                    onClick={() => setDateRange(7)}
                  >
                    1 Week
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} block w-full text-left px-4 py-2 text-sm`}
                    onClick={() => setDateRange(30)}
                  >
                    1 Month
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} block w-full text-left px-4 py-2 text-sm`}
                    onClick={() => setDateRange(90)}
                  >
                    3 Months
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} block w-full text-left px-4 py-2 text-sm`}
                    onClick={() => setDateRange(180)}
                  >
                    6 Months
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} block w-full text-left px-4 py-2 text-sm`}
                    onClick={() => setDateRange(365)}
                  >
                    1 Year
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  );
};

export default PerformanceGraph;