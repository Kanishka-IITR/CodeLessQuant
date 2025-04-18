import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const EquityGraph = ({ equityData }) => {
  // Check if equityData exists and is in correct format
  if (!equityData || equityData.length === 0) {
    return <div>No data to display.</div>;
  }

  // Format data for the chart
  const chartData = {
    labels: equityData.map((data, index) => `Day ${index + 1}`),
    datasets: [
      {
        label: 'Equity Curve',
        data: equityData.map(data => data.balance), // assuming balance or equity is in 'balance'
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <Line data={chartData} />
    </div>
  );
};

export default EquityGraph;
