import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Sparkles } from 'lucide-react';

const getRandomColor = () => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgba(${r}, ${g}, ${b}, 0.7)`;
};

const baseColors = [
  'rgba(236, 72, 153, 0.7)',  // pink
  'rgba(139, 92, 246, 0.7)',  // violet
  'rgba(56, 214, 183, 0.7)',  // teal
  'rgba(245, 158, 11, 0.7)',  // amber
  'rgba(99, 102, 241, 0.7)',  // indigo
  'rgba(248, 113, 113, 0.7)', // red
  'rgba(52, 211, 153, 0.7)',  // emerald
  'rgba(251, 146, 60, 0.7)',  // orange
];

const PieChart = ({ data }) => {
  // Generate colors array based on number of data points
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
            size: 12,
            family: "'Inter', sans-serif",
          },
          color: '#6b7280',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#111827',
        bodyColor: '#4b5563',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        boxPadding: 4,
        callbacks: {
          label: (context) => {
            const value = parseFloat(context.raw);
            const sum = context.dataset.data
              .reduce((a, b) => parseFloat(a) + parseFloat(b), 0);
            const percentage = ((value / sum) * 100).toFixed(1);
            return `${context.label}: £${value.toLocaleString(undefined, {
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
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-xl font-semibold bg-gradient-to-r from-pink-500 to-violet-500 text-transparent bg-clip-text">
          Holdings Distribution
        </h2>
        <Sparkles className="w-5 h-5 text-pink-500" />
      </div>
      
      <div className="h-64 relative">
        <Pie data={enhancedData} options={options} />
      </div>
    </div>
  );
};

export default PieChart;