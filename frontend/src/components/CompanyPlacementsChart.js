import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import './CompanyPlacementsChart.css';
import PropTypes from 'prop-types';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

function generateColor(index) {
    const hue = index * 360 / 20;
    return `hsl(${hue}, 95%, 50%)`;
}

function CompanyPlacementsChart({ year }) {
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [noData, setNoData] = useState(false);

    useEffect(() => {
        const fetchData = async() => {
            setLoading(true);
            setError(null);
            setNoData(false);
            try {
                const response = await axios.get('/api/placements/chart-data', {
                    params: { year }
                });

                const { labels, values } = response.data;

                if (labels.length === 0) {
                    setNoData(true);
                } else {
                    setChartData({
                        labels,
                        datasets: [{
                            label: 'Number of Placements',
                            data: values,
                            backgroundColor: labels.map((_, index) => generateColor(index)),
                            borderColor: labels.map((_, index) => generateColor(index)),
                            borderWidth: 1,
                        }],
                    });
                }
            } catch (error) {
                setError('Error loading chart data: ' + error.message);
                console.error('Error loading chart data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (year) {
            fetchData();
        }
    }, [year]);

    return ( <
            div className = "chart-container" >
            <
            h2 className = "chart-header" > Company wise Placements in { year || 'All Years' } < /h2> {
            loading ? ( <
                p > Loading... < /p>
            ) : error ? ( <
                p > { error } < /p>
            ) : noData ? ( <
                p className = "message" > No data was found
                for the selected year. < /p>
            ) : ( <
                div className = "chart-wrapper" >
                <
                Pie data = { chartData }
                options = {
                    {
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    label: function(tooltipItem) {
                                        const dataIndex = tooltipItem.dataIndex;
                                        const value = chartData.datasets[0].data[dataIndex];
                                        const total = chartData.datasets[0].data.reduce((acc, curr) => acc + curr, 0);
                                        const percentage = ((value / total) * 100).toFixed(2);
                                        return `${chartData.labels[dataIndex]}: ${value} (${percentage}%)`;
                                    }
                                }
                            },
                            legend: {
                                labels: {
                                    color: '#000'
                                }
                            }
                        },
                        responsive: true,
                        maintainAspectRatio: false
                    }
                }
                /> < /
                div >
            )
        } <
        /div>
);
}

CompanyPlacementsChart.propTypes = {
    year: PropTypes.number.isRequired,
};

export default CompanyPlacementsChart;