import React from 'react';
import { Pie } from 'react-chartjs-2';
import { PieChart as PieChartIcon } from 'lucide-react';

const baseColors = [
  'rgba(56, 214, 183, 0.7)',  // teal (matching the line graph)
  'rgba(217, 56, 108, 0.7)',  // complementary pink/red
  'rgba(56, 107, 214, 0.7)',  // complementary blue
  'rgba(214, 203, 56, 0.7)',  // complementary gold
  'rgba(245, 158, 11, 0.7)',  // amber
  'rgba(99, 102, 241, 0.7)',  // indigo
  'rgba(252, 96, 176, 0.7)',  // bright magenta
  'rgba(251, 146, 60, 0.7)',  // orange
  'rgba(52, 211, 153, 0.7)',  // emerald (similar tone)
];


const getRandomColor = () => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgba(${r}, ${g}, ${b}, 0.7)`;
};

const PieChart = ({ data, title = 'Holdings Distribution' }) => {
  const generateColors = (length) => {
    let colors = [...baseColors];
    if (length > baseColors.length) {
      for (let i = baseColors.length; i < length; i++) {
        colors.push(getRandomColor());
      }
    }
    return colors.slice(0, length);
  };

  const colors = generateColors(data.labels.length);

  // Calculate total value for percentage in title
  const totalValue = data.datasets[0].data.reduce((sum, value) => sum + parseFloat(value), 0);

  const enhancedData = {
    labels: data.labels,
    datasets: [{
      data: data.datasets[0].data.map(value => Number(value).toFixed(2)),
      backgroundColor: colors,
      hoverBackgroundColor: colors.map(color => color.replace('0.7', '0.9')),
      borderWidth: 2,
      borderColor: '#ffffff',
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            family: '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto',
            size: 12,
            weight: 500
          },
          color: '#94a3b8',
        },
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
        displayColors: true,
        boxPadding: 4,
        callbacks: {
          label: (context) => {
            const value = parseFloat(context.raw);
            const sum = context.dataset.data
              .reduce((a, b) => parseFloat(a) + parseFloat(b), 0);
            const percentage = ((value / sum) * 100).toFixed(1);
            return `${context.label}: £${value.toLocaleString('en-GB', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })} (${percentage}%)`;
          },
        },
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000,
      easing: 'easeInOutQuart',
    },
    elements: {
      arc: {
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverBorderColor: '#ffffff',
        hoverBorderWidth: 3,
        hoverOffset: 8,
      },
    },
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 relative">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <PieChartIcon className="text-[#38d6b7] w-6 h-6" />
            {title}
          </h2>
        </div>
      </div>
      
      <div className="h-72 relative mb-6">
        {data.labels.length > 0 ? (
          <Pie data={enhancedData} options={options} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No data available
          </div>
        )}
      </div>
    </div>
  );
};

export default PieChart;