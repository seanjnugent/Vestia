import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-moment';
import moment from 'moment';
import { TrendingUp } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

ChartJS.register(...registerables);

const DEFAULT_DAYS = 90;

const PerformanceGraph = ({ portfolioHistory }) => {
  const [dateRange, setDateRange] = useState(DEFAULT_DAYS);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    // Add console.log to debug incoming data
    console.log('Raw portfolioHistory:', portfolioHistory);

    if (!portfolioHistory || portfolioHistory.length === 0) {
      console.warn('No portfolio history available.');
      setFilteredData([]);
      return;
    }

    // Ensure proper parsing of dates and values
    const processedData = portfolioHistory.map(item => ({
      ...item,
      performance_date: moment(item.performance_date).startOf('day'),
      total_asset_value: parseFloat(item.total_asset_value) || 0,
      cash_balance: parseFloat(item.cash_balance) || 0
    }));

    const sortedData = processedData.sort((a, b) =>
      a.performance_date.valueOf() - b.performance_date.valueOf()
    );

    const cutoffDate = moment().subtract(dateRange, 'days').startOf('day');
    const filtered = sortedData.filter(item =>
      item.performance_date.isAfter(cutoffDate)
    );

    console.log('Processed and filtered data:', filtered);
    setFilteredData(filtered);
  }, [dateRange, portfolioHistory]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
          displayFormats: {
            day: 'MMM D'
          },
          tooltipFormat: 'MMM D, YYYY'
        },
        ticks: {
          maxTicksLimit: 10,
          autoSkip: true,
          color: '#6b7280',
        },
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: false,
        ticks: {
          color: '#6b7280',
          callback: function(value) {
            return '£' + value.toLocaleString();
          }
        },
        grid: {
          display: true,
          color: 'rgba(107, 114, 128, 0.1)'
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          color: '#6b7280'
        }
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#111827',
        bodyColor: '#111827',
        borderColor: '#38d6b7',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          title: function(context) {
            return moment(context[0].raw.x).format('ddd, MMM D, YYYY');
          },
          label: function(context) {
            return `${context.dataset.label}: £${context.raw.y.toLocaleString()}`;
          }
        }
      }
    }
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
        backgroundColor: 'rgba(56, 214, 183, 0.1)',
        fill: true,
        tension: 0.4,  // Smooth curve
        pointRadius: 0,  // Remove nodes
      },
      {
        label: 'Assets',
        data: filteredData.map(item => ({
          x: item.performance_date.toDate(),
          y: item.total_asset_value,
        })),
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true,
        tension: 0.4,  // Smooth curve
        pointRadius: 0,  // Remove nodes
      },
      {
        label: 'Cash',
        data: filteredData.map(item => ({
          x: item.performance_date.toDate(),
          y: item.cash_balance,
        })),
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        fill: true,
        tension: 0.4,  // Smooth curve
        pointRadius: 0,  // Remove nodes
      },
    ],
  };
  

  const handleRangeChange = (value) => {
    setDateRange(value[0]);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-teal-500" />
          <h2 className="text-xl font-semibold text-gray-800">Performance</h2>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Last {dateRange} days</span>
        </div>
      </div>
      
      <div className="mb-6">
        <Slider
          defaultValue={[DEFAULT_DAYS]}
          max={365}
          min={7}
          step={1}
          className="w-full"
          onValueChange={handleRangeChange}
        />
        <div className="flex justify-between mt-2 text-sm text-gray-500">
          <span>7d</span>
          <span>1y</span>
        </div>
      </div>

      <div className="h-64 relative">
        {filteredData.length > 0 ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No data available for the selected period
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceGraph;