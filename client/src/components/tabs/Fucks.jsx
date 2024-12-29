import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import useAppContext from "@/hooks/useAppContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function Fucks() {
  const { users } = useAppContext(); // Fetch users with their joinedAt time (timestamp in milliseconds)
  const [timeSpent, setTimeSpent] = useState([]); // State to hold the time spent by users

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date().getTime(); // Get current time in milliseconds

      // Process Data on every interval
      const newTimeSpent = users.map((user) => {
        const joinedAt = user.joinedAt; // This should be a timestamp in milliseconds

        // Calculate the difference in milliseconds
        const timeDifferenceInMs = currentTime - joinedAt;

        // Convert milliseconds to minutes
        const timeDifferenceInMinutes = Math.floor(timeDifferenceInMs / (1000 * 60)); // Convert to minutes
        return timeDifferenceInMinutes;
      });

      setTimeSpent(newTimeSpent);
    }, 1); // Update every minute

    // Clear interval when the component unmounts
    return () => clearInterval(interval);
  }, [users]); // Only re-run when users data changes

  // Process labels for the charts
  const labels = users.map((user) => user.username);

  // Bar Chart Data
  const barData = {
    labels,
    datasets: [
      {
        label: 'Minutes Spent',
        data: timeSpent,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        borderColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        borderWidth: 1,
      },
    ],
  };

  // Pie Chart Data
  const pieData = {
    labels,
    datasets: [
      {
        label: 'Proportion of Time Spent',
        data: timeSpent,
        backgroundColor: ['#FFB74D', '#66BB6A', '#29B6F6', '#AB47BC', '#EC407A'],
        borderColor: '#121212',
        borderWidth: 1,
      },
    ],
  };

  // Chart Options
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Time Spent by Users (in Minutes)',
        color: '#E0E0E0',
        font: { size: 16 },
      },
      legend: {
        labels: {
          color: '#E0E0E0',
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.raw.toFixed(2)} minutes`,
        },
      },
    },
    scales: {
      y: {
        ticks: {
          color: '#E0E0E0',
        },
        grid: {
          color: '#333333',
        },
        beginAtZero: true,
      },
      x: {
        ticks: {
          color: '#E0E0E0',
        },
        grid: {
          color: '#333333',
        },
      },
    },
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#121212',
        padding: '20px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '90%',
          height: '85%',
          backgroundColor: '#1E1E1E',
          borderRadius: '10px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.7)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'row',
          gap: '20px',
          overflow: 'hidden',
        }}
      >
        {/* Bar Chart */}
        <div style={{ flex: 1, padding: '10px' }}>
          <h3 style={{ color: '#E0E0E0', textAlign: 'center' }}>Bar Chart</h3>
          <Bar data={barData} options={options} />
        </div>

        {/* Pie Chart */}
        <div style={{ flex: 1, padding: '10px' }}>
          <h3 style={{ color: '#E0E0E0', textAlign: 'center' }}>Pie Chart</h3>
          <Pie data={pieData} options={options} />
        </div>
      </div>
    </div>
  );
}

export default Fucks;
