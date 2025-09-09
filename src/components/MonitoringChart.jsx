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
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  ChartDataLabels 
);

const MonitoringChart = ({ sgaData = [], pgaData = [], sessionData = [], chartType }) => {
  const theme = useTheme();

  const formatMemoryData = (data, backgroundColor, borderColor, cleanLabels = false) => {
    const chartLabels = data.slice(1).map(item => {
      let labelParts = [];
      if (item.col1 && isNaN(parseFloat(item.col1))) labelParts.push(item.col1);
      if (item.col2 && isNaN(parseFloat(item.col2))) labelParts.push(item.col2);
      
      const label = labelParts.length > 0 ? labelParts.join(' ') : 'Unknown';
      return cleanLabels ? label.replace(/\s*\d+\s*/g, '').trim() : label;
    });
    
    const chartValues = data.slice(1).map(item => {
      let value = 0;
      if (item.col4) {
        value = parseFloat(item.col4) || 0;
      } else if (item.col3 && !isNaN(parseFloat(item.col3))) {
        value = parseFloat(item.col3);
      } else if (item.col2 && !isNaN(parseFloat(item.col2))) {
        value = parseFloat(item.col2);
      }
      return value;
    });

    return {
      labels: chartLabels,
      datasets: [{
        label: 'Size (MB)',
        data: chartValues,
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 1,
      }],
    };
  };

  const getMemoryChartOptions = (chartTitle) => ({
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: chartTitle,
        font: {
          size: 18,
          weight: 'bold',
        },
        padding: {
            top: 10,
            bottom: 20
        }
      },
      tooltip: {
        enabled: true,
      },
      datalabels: {
        display: function(context) {
          const value = context.dataset.data[context.dataIndex];
          return value < 30;
        },
        formatter: (value) => {
          return value;
        },
        color: theme.palette.text.primary,
        anchor: 'end',
        align: 'end',
        offset: 8,
        font: {
          weight: 'bold',
        },
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
            borderColor: theme.palette.divider,
        },
        ticks: {
            color: theme.palette.text.secondary,
        },
        title: {
          display: true,
          text: 'Size (MB)'
        }
      },
      y: {
        grid: {
            display: false,
        },
        ticks: {
            color: theme.palette.text.secondary,
        }
      }
    },
  });

  const formatSessionData = () => {
    const labels = sessionData.map(item => item?.col1 || 'Unknown').slice(1); // slice(1) to skip header
    const values = sessionData.map(item => parseInt(item?.col2) || 0).slice(1); // slice(1) to skip header

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
        borderWidth: 2,
      }],
    };
  };

  const sessionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
      // Disable datalabels for the doughnut chart
      datalabels: {
        display: false,
      }
    },
  };

  const sgaColors = {
    bg: 'rgba(54, 162, 235, 0.6)', // Blue
    border: 'rgba(54, 162, 235, 1)',
  };

  const pgaColors = {
    bg: 'rgba(255, 99, 132, 0.6)', // Pink/Red
    border: 'rgba(255, 99, 132, 1)',
  };

  return (
    <Box sx={{ width: '100%' }}>
      {chartType === 'memory' && (
        <Box>
          {sgaData.length > 1 && (
            <Box sx={{ height: '300px', mb: 4 }}>
              <Bar 
                data={formatMemoryData(sgaData, sgaColors.bg, sgaColors.border, true)}
                options={getMemoryChartOptions('SGA Components')} 
              />
            </Box>
          )}
          {pgaData.length > 1 && (
            <Box sx={{ height: '200px' }}>
              <Bar 
                data={formatMemoryData(pgaData, pgaColors.bg, pgaColors.border, false)}
                options={getMemoryChartOptions('PGA Components')} 
              />
            </Box>
          )}
        </Box>
      )}

      {chartType === 'session' && sessionData.length > 0 && (
        <Box sx={{ height: 400 }}>
            {/* THIS IS THE CORRECTED LINE */}
            <Doughnut data={formatSessionData()} options={sessionOptions} />
        </Box>
      )}
    </Box>
  );
};

export default MonitoringChart;