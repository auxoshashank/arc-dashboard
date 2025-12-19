import React, { useEffect, useRef, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import csvData from './housing_results/my_eda_analysis/data/hyp_00bda110_13_yearbuilt_vs_saleprice.csv';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const YearBuiltVsSalePriceChart = () => {
  const [chartData, setChartData] = useState(null);
  const [stats, setStats] = useState({
    totalPoints: 0,
    avgPrice: 0,
    yearRange: '',
  });

  useEffect(() => {
    // Fetch and parse CSV data
    const loadData = async () => {
      try {
        const response = await fetch(csvData);
        const text = await response.text();

        // Parse CSV
        const lines = text.trim().split('\n');
        const parsedData = lines.slice(1).map(line => {
          const [year, mean, count] = line.split(',');
          return {
            year: parseInt(year),
            mean: parseFloat(mean),
            count: parseInt(count),
          };
        }).filter(d => !isNaN(d.year)); // Filter out any invalid rows

        // Extract arrays for chart
        const years = parsedData.map(d => d.year);
        const prices = parsedData.map(d => d.mean);
        const counts = parsedData.map(d => d.count);

        // Calculate statistics
        const totalPoints = parsedData.length;
        const avgPrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
        const yearRange = `${Math.min(...years)} - ${Math.max(...years)}`;

        setStats({
          totalPoints,
          avgPrice,
          yearRange,
        });

        // Prepare chart data
        setChartData({
          labels: years,
          datasets: [
            {
              label: 'Average Sale Price',
              data: prices,
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderWidth: 2,
              pointRadius: 3,
              pointHoverRadius: 5,
              tension: 0.1,
              counts: counts, // Store counts for tooltip
            },
          ],
        });
      } catch (error) {
        console.error('Error loading CSV data:', error);
      }
    };

    loadData();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Year Built vs Average Sale Price',
        font: {
          size: 18,
          weight: 'bold',
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const index = context.dataIndex;
            const price = '$' + Math.round(context.parsed.y).toLocaleString();
            const count = context.dataset.counts[index];
            return [
              'Avg Price: ' + price,
              'Count: ' + count + ' houses',
            ];
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Year Built',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        title: {
          display: true,
          text: 'Average Sale Price ($)',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
        ticks: {
          callback: function (value) {
            return '$' + value.toLocaleString();
          },
        },
      },
    },
  };

  if (!chartData) {
    return <div style={styles.loading}>Loading chart data...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.statsContainer}>
        <div style={styles.statItem}>
          <div style={styles.statLabel}>Total Data Points</div>
          <div style={styles.statValue}>{stats.totalPoints}</div>
        </div>
        <div style={styles.statItem}>
          <div style={styles.statLabel}>Avg Sale Price</div>
          <div style={styles.statValue}>${stats.avgPrice.toLocaleString()}</div>
        </div>
        <div style={styles.statItem}>
          <div style={styles.statLabel}>Year Range</div>
          <div style={styles.statValue}>{stats.yearRange}</div>
        </div>
      </div>
      <div style={styles.chartContainer}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  statsContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: '#f9f9f9',
    borderRadius: '4px',
  },
  statItem: {
    textAlign: 'center',
  },
  statLabel: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '8px',
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  chartContainer: {
    position: 'relative',
    height: '500px',
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '18px',
    color: '#666',
  },
};

export default YearBuiltVsSalePriceChart;
