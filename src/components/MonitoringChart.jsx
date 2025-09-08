import React from 'react';
import { Box } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const MonitoringChart = ({ sgaData = [], pgaData = [], sessionData = [], chartType }) => {
  const formatMemoryData = (label, data) => {
    const labels = data.map(item => item?.col1 || 'Unknown');
    const values = data.map(item => parseFloat(item?.col2) || 0);
    return {
      labels,
      datasets: [{
        label,
        data: values,
        backgroundColor: 'rgba(75,192,192,0.6)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
      }],
    };
  };

  const formatSessionData = () => {
    const labels = sessionData.map(item => item?.col1 || 'Unknown');
    const values = sessionData.map(item => parseInt(item?.col2) || 0);

    // Assign colors: gray for "INACTIVE", green for "ACTIVE", default blue for others
      const backgroundColor = labels.map(label => {
        if (label.toUpperCase() === 'INACTIVE') return '#808080'; // Gray
        if (label.toUpperCase() === 'ACTIVE') return '#FFA500'; // Orange
        return '#42a5f5'; // Default blue
      });

    return {
      labels,
      datasets: [{
        label: 'Sessions',
        data: values,
        backgroundColor,
        borderColor: '#fff',
        borderWidth: 1,
      }],
    };
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        enabled: false,
      },
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return (
    <Box sx={{ width: '100%', height: 400 }}>
      {chartType === 'memory' && (
        <>
          {sgaData.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Bar data={formatMemoryData('SGA', sgaData)} options={options} />
            </Box>
          )}
          {pgaData.length > 0 && (
            <Box>
              <Bar data={formatMemoryData('PGA', pgaData)} options={options} />
            </Box>
          )}
        </>
      )}

      {chartType === 'session' && sessionData.length > 0 && (
        <Doughnut data={formatSessionData()} options={options} 
 />
      )}
    </Box>
  );
};

export default MonitoringChart;
