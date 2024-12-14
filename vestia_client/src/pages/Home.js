import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useNavigate } from "react-router-dom";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Home = () => {
  const navigate = useNavigate();
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Portfolio Value (£)',
        data: [2000, 2200, 2300, 2400, 2450, 2500, 2540],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.4, // Smooth curve
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hide the legend
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // Remove x-axis grid
        },
      },
      y: {
        grid: {
          borderDash: [5, 5], // Dotted y-axis grid
        },
      },
    },
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Portfolio Widget */}
      <div className="flex-1 lg:w-2/3 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">My Portfolio</h2>
        <p className="text-4xl font-semibold text-gray-700 mb-6">£2540</p>
        <Line data={data} options={options} />
      </div>

      {/* Buttons */}
      <div className="flex flex-col justify-between gap-6 lg:w-1/3">
      <button
          onClick={() => navigate("/new-trade")}
          className="w-full px-4 py-6 text-white bg-green-500 rounded-lg hover:bg-green-600 shadow-md"
        >
          New Trade
        </button>
        <button
          onClick={() => navigate("/manage-cash")}
          className="w-full px-4 py-6 text-white bg-green-500 rounded-lg hover:bg-green-600 shadow-md"
        >
          Deposit or Withdraw Cash
        </button>
      </div>
    </div>
  );
};

export default Home;
