import React from 'react';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
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
  const theme = useTheme();
  const formatMemoryData = (label, data) => {
    const labels = data.map(item => item?.col1 || 'Unknown');
    const values = data.map(item => parseFloat(item?.col2) || 0);
    return {
      labels,
      datasets: [{
        label,
        data: values,
        backgroundColor: theme.palette.primary.main + '80', // 50% opacity
        borderColor: theme.palette.primary.main,
        borderWidth: 1,
      }],
    };
  };

  const formatSessionData = () => {
    const labels = sessionData.map(item => item?.col1 || 'Unknown');
    const values = sessionData.map(item => parseInt(item?.col2) || 0);

    // Assign colors: gray for "INACTIVE", warning for "ACTIVE", default primary for others
      const backgroundColor = labels.map(label => {
        if (label.toUpperCase() === 'INACTIVE') return theme.palette.grey[500];
        if (label.toUpperCase() === 'ACTIVE') return theme.palette.warning.main;
        return theme.palette.primary.main;
      });

    return {
      labels,
      datasets: [{
        label: 'Sessions',
        data: values,
        backgroundColor,
        borderColor: theme.palette.common.white,
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
