import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import './CTCChart.css';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
const CTCChart = () => {
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        axios.get('/api/students/ctc-by-school-year')
            .then(response => {
                const data = response.data;
                console.log('Backend data:', data);

                if (!data || data.length === 0) {
                    console.log("No data received");
                    setLoading(false);
                    return;
                }
                const schools = [...new Set(data.map(item => item.school))];
                const years = [...new Set(data.map(item => item.year))].sort((a, b) => a - b);
                const maxCTCColors = ['#003366', '#1c7a2f', '#cc4629', '#cc7a00', '#5a2d99'];
                const avgCTCColors = ['#66a3ff', '#66d98c', '#ff9e5c', '#ffb84d', '#9c66d9'];
                const datasets = schools.map((school, index) => {
                    const maxCTCData = years.map(year => {
                        const item = data.find(d => d.school === school && d.year === year);
                        return item ? item.maxCTC : null;
                    });

                    const avgCTCData = years.map(year => {
                        const item = data.find(d => d.school === school && d.year === year);
                        return item ? item.avgCTC : null;
                    });

                    console.log(`${school} Data:`, { maxCTCData, avgCTCData });

                    return [{
                            label: `${school} Max CTC`,
                            data: maxCTCData,
                            backgroundColor: 'transparent',
                            borderColor: maxCTCColors[index % maxCTCColors.length],
                            borderWidth: 2,
                            fill: false
                        },
                        {
                            label: `${school} Avg CTC`,
                            data: avgCTCData,
                            backgroundColor: 'transparent',
                            borderColor: avgCTCColors[index % avgCTCColors.length],
                            borderWidth: 2,
                            fill: false
                        }
                    ];
                }).flat();

                setChartData({
                    labels: years,
                    datasets
                });
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                setLoading(false);
            });
    }, []);

    return ( <
        div >
        <
        h2 > CTC Analysis < /h2> <
        p className = "one" >
        <
        strong className = "red-text" >
        Discription:
        <
        /strong> It displays the Maximum and Average CTC for each school in each year. < /
        p > {
            loading ? ( <
                p > Loading chart data... < /p>
            ) : chartData ? ( <
                div className = "chart-container" >
                <
                Line data = { chartData }
                options = {
                    {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'Year'
                                }
                            },
                            y: {
                                beginAtZero: false,
                                title: {
                                    display: true,
                                    text: 'CTC in LPA'
                                },
                                ticks: {
                                    callback: function(value) {
                                        return value + ' LPA';
                                    }
                                }
                            }
                        },
                        plugins: {
                            legend: {
                                position: 'top',
                                labels: {
                                    boxWidth: 20,
                                    padding: 15
                                }
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(tooltipItem) {
                                        return tooltipItem.raw + ' LPA';
                                    }
                                }
                            }
                        }
                    }
                }
                /> < /
                div >
            ) : ( <
                p > No data available to display. < /p>
            )
        } <
        /div>
    );
};

export default CTCChart;