import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import './MoreData.css';

const MoreData = () => {
        const [years, setYears] = useState([]);
        const [firstYear, setFirstYear] = useState('');
        const [secondYear, setSecondYear] = useState('');
        const [data, setData] = useState(null);

        useEffect(() => {
            const fetchUniqueYears = async() => {
                try {
                    const response = await axios.get('http://localhost:1000/api/suggest-years');
                    console.log('Fetched years:', response.data.years);
                    setYears(response.data.years || []);
                } catch (error) {
                    console.error('Error fetching years:', error);
                }
            };

            fetchUniqueYears();
        }, []);

        const generateYearRange = (startYear) => {
            const start = parseInt(startYear, 10);
            return Array.from({ length: 5 }, (v, i) => start + i);
        };

        const handleCompare = async() => {
            if (firstYear && secondYear) {
                const firstYearRange = generateYearRange(firstYear);
                const secondYearRange = generateYearRange(secondYear);

                try {
                    const response = await axios.post('http://localhost:1000/api/compare-years', {
                        firstYearRange,
                        secondYearRange,
                    });

                    const { statuses, firstYearData, secondYearData } = response.data;
                    const chartData = {
                        labels: statuses,
                        datasets: [{
                                label: `Data for ${firstYearRange.join(', ')}`,
                                data: firstYearData,
                                backgroundColor: '#5C8374',
                            },
                            {
                                label: `Data for ${secondYearRange.join(', ')}`,
                                data: secondYearData,
                                backgroundColor: '#FF8F8F',
                            },
                        ],
                    };

                    setData(chartData);
                } catch (error) {
                    console.error('Error comparing year ranges:', error);
                }
            } else {
                console.log('Please select both years.');
            }
        };

        return ( <
                div className = "more-data-page" >
                <
                h2 > Compare Placement Statistics < /h2> <
                div className = "selectors" >
                <
                div className = "dropdowns" >
                <
                select value = { firstYear }
                onChange = {
                    (e) => setFirstYear(e.target.value)
                } >
                <
                option value = "" > Select Year
                for First Range < /option> {
                years.length > 0 ? (
                    years.map((year) => ( <
                        option key = { year }
                        value = { year } > { year } < /option>
                    ))
                ) : ( <
                    option value = "" > No Years Available < /option>
                )
            } <
            /select>

        <
        select value = { secondYear }
        onChange = {
                (e) => setSecondYear(e.target.value)
            } >
            <
            option value = "" > Select Year
        for Second Range < /option> {
        years.length > 0 ? (
            years.map((year) => ( <
                option key = { year }
                value = { year } > { year } < /option>
            ))
        ) : ( <
            option value = "" > No Years Available < /option>
        )
    } <
    /select> < /
div >

    <
    div className = "button-container" >
    <
    button onClick = { handleCompare }
className = "submitt-btn" > Submit < /button> < /
div > <
    /div>

{
    data && ( <
        div className = "results" >
        <
        Bar data = { data }
        options = {
            {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Counts',
                        },
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Application Status',
                        },
                    },
                },
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => `${context.dataset.label}: ${context.raw}`,
                        },
                    },
                },
            }
        }
        /> < /
        div >
    )
} <
/div>
);
};

export default MoreData;