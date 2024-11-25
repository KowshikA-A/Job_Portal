import React, { useEffect, useState } from 'react';
import './YearlyPlacedStudentsChart.css';
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
    const [allStats, setAllStats] = useState([]);

    useEffect(() => {
        const fetchData = async() => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:1000/api/stats');
                const stats = response.data;
                if (!Array.isArray(stats)) {
                    throw new Error('Unexpected data format');
                }

                setAllStats(stats);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.message || 'Error fetching data');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const sortedStats = allStats.sort((a, b) => a.year - b.year);

    const yearsForChart = sortedStats.map(item => item.year);
    const placedCounts = sortedStats.map(item => item.placed);
    const notPlacedCounts = sortedStats.map(item => item.notPlaced);

    const chartDataForDisplay = {
        labels: yearsForChart,
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
        h1 className = "oneee" > Placement Analysis < /h1> <
        p className = "one" >
        <
        strong className = "red-text" >
        Discription:
        <
        /strong> It displays the count of placed and not placed students for each year. When hovering over the lines in the graphs for a specific year, it will show the count of students along with the percentage of students. < /
        p > {} {
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

                                        const placedCount = chartDataForDisplay.datasets[0].data[index];
                                        const notPlacedCount = chartDataForDisplay.datasets[1].data[index];

                                        const total = placedCount + notPlacedCount;
                                        const placedPercentage = total > 0 ? ((placedCount / total) * 100).toFixed(2) : 0;
                                        const notPlacedPercentage = total > 0 ? ((notPlacedCount / total) * 100).toFixed(2) : 0;

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
                                    text: 'Year',
                                },
                                type: 'category',
                                ticks: {
                                    autoSkip: false,
                                },
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Number of Students',
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