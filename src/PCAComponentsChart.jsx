import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Scatter, Bar } from 'react-chartjs-2';
import csvData from './housing_04_11/my_eda_analysis/data/hyp_93542f5a_9_pca_components.csv';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PCAComponentsChart = () => {
  const [pcaData, setPcaData] = useState(null);
  const [scatterData, setScatterData] = useState(null);
  const [varianceData, setVarianceData] = useState(null);
  const [stats, setStats] = useState({
    totalSamples: 0,
    totalFeatures: 0,
    pcVariance: [],
  });
  const [selectedComponents, setSelectedComponents] = useState({ x: 0, y: 1 });

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch(csvData);
        const text = await response.text();

        // Parse CSV
        const lines = text.trim().split('\n');
        const headers = lines[0].split(',');

        const parsedData = lines.slice(1).map(line => {
          const values = line.split(',');
          const row = {};
          headers.forEach((header, index) => {
            row[header] = parseFloat(values[index]);
          });
          return row;
        }).filter(row => !isNaN(row.Id)); // Filter out any invalid rows

        // Extract feature columns (excluding Id and original features)
        const featureColumns = headers.slice(1, 37); // Original features
        const pcColumns = headers.slice(37); // PCA components (if any additional columns)

        // Calculate variance for each original feature across samples
        const featureVariances = featureColumns.map(feature => {
          const values = parsedData.map(row => row[feature]);
          const mean = values.reduce((a, b) => a + b, 0) / values.length;
          const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
          return { feature, variance };
        });

        // Sort by variance to find most important features
        featureVariances.sort((a, b) => b.variance - a.variance);

        setStats({
          totalSamples: parsedData.length,
          totalFeatures: featureColumns.length,
          pcVariance: featureVariances.slice(0, 10), // Top 10
        });

        setPcaData(parsedData);

        // Create variance chart data
        setVarianceData({
          labels: featureVariances.slice(0, 15).map(f => f.feature),
          datasets: [
            {
              label: 'Feature Variance',
              data: featureVariances.slice(0, 15).map(f => f.variance),
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgb(75, 192, 192)',
              borderWidth: 1,
            },
          ],
        });

        // Create initial scatter plot data (first two features)
        updateScatterData(parsedData, featureColumns[0], featureColumns[1]);
      } catch (error) {
        console.error('Error loading CSV data:', error);
      }
    };

    loadData();
  }, []);

  const updateScatterData = (data, xFeature, yFeature) => {
    if (!data) return;

    const scatterPoints = data.map(row => ({
      x: row[xFeature],
      y: row[yFeature],
      id: row.Id,
    }));

    setScatterData({
      datasets: [
        {
          label: `${xFeature} vs ${yFeature}`,
          data: scatterPoints,
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgb(255, 99, 132)',
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    });
  };

  const handleFeatureChange = (axis, index) => {
    if (!pcaData) return;

    const newSelected = { ...selectedComponents };
    newSelected[axis] = index;
    setSelectedComponents(newSelected);

    const headers = Object.keys(pcaData[0]);
    const featureColumns = headers.slice(1, 37);
    updateScatterData(pcaData, featureColumns[newSelected.x], featureColumns[newSelected.y]);
  };

  const scatterOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'PCA Components - Feature Scatter Plot',
        font: {
          size: 18,
          weight: 'bold',
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const point = context.raw;
            return [
              `ID: ${point.id}`,
              `X: ${point.x.toFixed(6)}`,
              `Y: ${point.y.toFixed(6)}`,
            ];
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'X-Axis Feature',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
      },
      y: {
        title: {
          display: true,
          text: 'Y-Axis Feature',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
      },
    },
  };

  const varianceOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Top 15 Features by Variance',
        font: {
          size: 18,
          weight: 'bold',
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return 'Variance: ' + context.parsed.y.toFixed(6);
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Features',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
        ticks: {
          maxRotation: 90,
          minRotation: 45,
          font: {
            size: 10,
          },
        },
      },
      y: {
        title: {
          display: true,
          text: 'Variance',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
        ticks: {
          callback: function (value) {
            return value.toFixed(6);
          },
        },
      },
    },
  };

  if (!pcaData || !scatterData || !varianceData) {
    return <div style={styles.loading}>Loading PCA data...</div>;
  }

  const headers = Object.keys(pcaData[0]);
  const featureColumns = headers.slice(1, 37);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>PCA Components Analysis</h1>

      <div style={styles.statsContainer}>
        <div style={styles.statItem}>
          <div style={styles.statLabel}>Total Samples</div>
          <div style={styles.statValue}>{stats.totalSamples}</div>
        </div>
        <div style={styles.statItem}>
          <div style={styles.statLabel}>Total Features</div>
          <div style={styles.statValue}>{stats.totalFeatures}</div>
        </div>
        <div style={styles.statItem}>
          <div style={styles.statLabel}>Top Feature (by variance)</div>
          <div style={styles.statValue}>{stats.pcVariance[0]?.feature || 'N/A'}</div>
        </div>
      </div>

      {/* Feature Selection Controls */}
      <div style={styles.controlsContainer}>
        <div style={styles.controlGroup}>
          <label style={styles.controlLabel}>X-Axis Feature:</label>
          <select
            style={styles.select}
            value={selectedComponents.x}
            onChange={(e) => handleFeatureChange('x', parseInt(e.target.value))}
          >
            {featureColumns.map((feature, index) => (
              <option key={index} value={index}>{feature}</option>
            ))}
          </select>
        </div>
        <div style={styles.controlGroup}>
          <label style={styles.controlLabel}>Y-Axis Feature:</label>
          <select
            style={styles.select}
            value={selectedComponents.y}
            onChange={(e) => handleFeatureChange('y', parseInt(e.target.value))}
          >
            {featureColumns.map((feature, index) => (
              <option key={index} value={index}>{feature}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Scatter Plot */}
      <div style={styles.chartContainer}>
        <Scatter data={scatterData} options={scatterOptions} />
      </div>

      {/* Variance Bar Chart */}
      <div style={styles.chartContainer}>
        <Bar data={varianceData} options={varianceOptions} />
      </div>

      {/* Top Features Table */}
      <div style={styles.tableContainer}>
        <h3 style={styles.tableTitle}>Top 10 Features by Variance</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Rank</th>
              <th style={styles.th}>Feature</th>
              <th style={styles.th}>Variance</th>
            </tr>
          </thead>
          <tbody>
            {stats.pcVariance.map((item, index) => (
              <tr key={index} style={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
                <td style={styles.td}>{index + 1}</td>
                <td style={styles.td}>{item.feature}</td>
                <td style={styles.td}>{item.variance.toFixed(6)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f5f5f5',
  },
  title: {
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: '20px',
    fontSize: '32px',
  },
  statsContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '20px',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
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
  controlsContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '30px',
    marginBottom: '20px',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  controlGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  controlLabel: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  select: {
    padding: '8px 12px',
    fontSize: '14px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    backgroundColor: 'white',
    cursor: 'pointer',
    minWidth: '200px',
  },
  chartContainer: {
    position: 'relative',
    height: '500px',
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  tableContainer: {
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  tableTitle: {
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: '15px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '12px',
    textAlign: 'left',
    backgroundColor: '#2c3e50',
    color: 'white',
    fontWeight: 'bold',
    borderBottom: '2px solid #ddd',
  },
  td: {
    padding: '10px 12px',
    borderBottom: '1px solid #ddd',
  },
  evenRow: {
    backgroundColor: '#f9f9f9',
  },
  oddRow: {
    backgroundColor: 'white',
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '18px',
    color: '#666',
  },
};

export default PCAComponentsChart;
