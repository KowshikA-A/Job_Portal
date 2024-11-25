import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
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

// Register necessary components with Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const YearlyStudentStatusChart = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [allStats, setAllStats] = useState([]); // Full data fetched from the API

    useEffect(() => {
        const fetchData = async() => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:1000/api/stats');
                const stats = response.data;

                // Check if stats is an array
                if (!Array.isArray(stats)) {
                    throw new Error('Unexpected data format');
                }

                setAllStats(stats); // Store the full dataset
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.message || 'Error fetching data');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Sort allStats by year in ascending order
    const sortedStats = allStats.sort((a, b) => a.year - b.year);

    // Prepare data for chart based on sorted stats
    const yearsForChart = sortedStats.map(item => item.year);
    const placedCounts = sortedStats.map(item => item.placed);
    const notPlacedCounts = sortedStats.map(item => item.notPlaced);

    const chartDataForDisplay = {
        labels: yearsForChart, // Show all years in ascending order
        datasets: [{
                label: 'Placed Students',
                data: placedCounts,
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,0.2)',
                borderWidth: 1,
            },
            {
                label: 'Not Placed Students',
                data: notPlacedCounts,
                borderColor: 'rgba(255,99,132,1)',
                backgroundColor: 'rgba(255,99,132,0.2)',
                borderWidth: 1,
            },
        ],
    };

    if (loading) {
        return <p > Loading chart data... < /p>;
    }

    if (error) {
        return <p > Error: { error } < /p>;
    }

    return ( <
        div >
        <
        h2 > Placement Analysis < /h2>

        { /* Render chart */ } {
            chartDataForDisplay.labels.length > 0 ? ( <
                Line data = { chartDataForDisplay }
                options = {
                    {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        const dataset = context.dataset;
                                        const index = context.dataIndex;

                                        // Get the placed and not placed values
                                        const placedCount = chartDataForDisplay.datasets[0].data[index];
                                        const notPlacedCount = chartDataForDisplay.datasets[1].data[index];

                                        // Calculate the total and percentages
                                        const total = placedCount + notPlacedCount;
                                        const placedPercentage = total > 0 ? ((placedCount / total) * 100).toFixed(2) : 0;
                                        const notPlacedPercentage = total > 0 ? ((notPlacedCount / total) * 100).toFixed(2) : 0;

                                        // Construct the label with count and percentage
                                        if (dataset.label === 'Placed Students') {
                                            return `${dataset.label}: ${placedCount} (${placedPercentage}%)`;
                                        } else if (dataset.label === 'Not Placed Students') {
                                            return `${dataset.label}: ${notPlacedCount} (${notPlacedPercentage}%)`;
                                        }
                                    },
                                },
                            },
                        },
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'Year', // X-axis label
                                },
                                type: 'category',
                                ticks: {
                                    autoSkip: false, // Show all year labels
                                },
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Number of Students', // Y-axis label
                                },
                            },
                        },
                    }
                }
                />
            ) : ( <
                p > No data available < /p>
            )
        } <
        /div>
    );
};

export default YearlyStudentStatusChart;