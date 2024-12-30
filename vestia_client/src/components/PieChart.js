// src/components/PieChart.js
import React from 'react';
import { Pie } from 'react-chartjs-2';

const PieChart = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Holdings Distribution</h2>
      <Pie data={data} />
    </div>
  );
};

export default PieChart;
