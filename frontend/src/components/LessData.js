import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import './LessData.css';

function Monitoring() {
    const [numYears, setNumYears] = useState(2);
    const [selectedYears, setSelectedYears] = useState(['', '']);
    const [companyList, setCompanyList] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState('');
    const [placementData, setPlacementData] = useState([]);

    const fetchCompanies = async(year) => {
        try {
            const response = await axios.get('/api/companies', { params: { year } });
            if (Array.isArray(response.data)) {
                setCompanyList(response.data);
            } else {
                console.error('Invalid company data structure:', response.data);
            }
        } catch (error) {
            console.error('Error fetching companies:', error);
        }
    };

    useEffect(() => {
        if (selectedYears[0]) {
            fetchCompanies(selectedYears[0]);
        }
    }, [selectedYears]);

    const handleNumYearsChange = (e) => {
        const num = Number(e.target.value);
        if (num >= 2 && num <= 10) {
            setNumYears(num);
            setSelectedYears(new Array(num).fill(''));
        } else {
            alert("Please select a number of years between 2 and 10.");
        }
    };

    const handleYearChange = (index, e) => {
        const newYear = e.target.value;
        if (selectedYears.includes(newYear)) {
            alert('Year already selected! Please select a different year.');
            return;
        }
        const newSelectedYears = [...selectedYears];
        newSelectedYears[index] = newYear;
        setSelectedYears(newSelectedYears);
        if (newYear) {
            fetchCompanies(newYear);
        }
    };

    const handleCompanyChange = (e) => {
        setSelectedCompany(e.target.value);
    };

    const fetchPlacementData = async() => {
        const payload = {
            years: selectedYears.filter(Boolean),
            company: selectedCompany || null,
        };

        try {
            const response = await axios.post('/api/placement', payload);
            if (Array.isArray(response.data)) {
                setPlacementData(response.data);
                console.log('Placement Data:', response.data);
            } else {
                console.error('Invalid placement data structure:', response.data);
            }
        } catch (error) {
            console.error('Error fetching placement data:', error);
        }
    };

    const normalizeStatus = (status) => {
        if (!status) return '';
        return status.trim().toLowerCase();
    };

    const labels = [...new Set(placementData.map(item => normalizeStatus(item.ApplicationStatus)))];

    const chartData = {
        labels: labels,
        datasets: selectedYears.map((year, index) => {
            const yearData = placementData.filter(item => item.Year === parseInt(year));
            const counts = {};

            yearData.forEach(item => {
                const status = normalizeStatus(item.ApplicationStatus);
                counts[status] = (counts[status] || 0) + 1;
            });

            return {
                label: `${year} Placements`,
                data: labels.map(label => counts[label] || 0),
                backgroundColor: `rgba(${(index + 1) * 50}, ${(index + 1) * 100}, ${(index + 1) * 150}, 0.6)`,
                borderColor: `rgba(${(index + 1) * 50}, ${(index + 1) * 100}, ${(index + 1) * 150}, 1)`,
                borderWidth: 1,
            };
        }),
    };

    const options = {
        plugins: {
            legend: {
                display: true,
            },
            datalabels: {
                anchor: 'end',
                align: 'end',
                formatter: (value) => value !== 0 ? value : '',
                color: 'black',
                font: {
                    weight: 'bold',
                    size: 12,
                },
                padding: {
                    top: -12,
                },
            },
        },
        responsive: true,
        maintainAspectRatio: false,
    };

    return ( <
        div className = "monitoring-container" >
        <
        h2 > Compare Placement Statistics < /h2> <
        label htmlFor = "numYears" > Select number of years to compare(min 2, max 10): < /label> <
        input id = "numYears"
        type = "number"
        value = { numYears }
        onChange = { handleNumYearsChange }
        min = "2"
        max = "10" /
        >

        <
        div className = "year-selection-container" > {
            Array.from({ length: numYears }).map((_, index) => ( <
                div key = { `year-dropdown-${index}` }
                className = "year-dropdown" >
                <
                label htmlFor = { `year${index}` } > Year { index + 1 }: < /label> <
                select id = { `year${index}` }
                value = { selectedYears[index] || '' }
                onChange = {
                    (e) => handleYearChange(index, e) } >
                <
                option key = { `year-empty-${index}` }
                value = "" > Select Year < /option> {
                    Array.from({ length: 20 }, (_, i) => 2025 - i).map((year) => ( <
                        option key = { `year-${year}-${index}` }
                        value = { year } > { year } < /option>
                    ))
                } <
                /select> <
                /div>
            ))
        } <
        /div>

        <
        label htmlFor = "company" > Select Company(Optional): < /label> <
        select id = "company"
        value = { selectedCompany }
        onChange = { handleCompanyChange } >
        <
        option key = "company-empty"
        value = "" > All Companies < /option> {
            companyList.length > 0 ? (
                companyList.map((company) => ( <
                    option key = { company._id }
                    value = { company.name } > { company.name } < /option>
                ))
            ) : ( <
                option key = "company-no-data"
                value = "" > No Companies Available < /option>
            )
        } <
        /select>

        <
        button className = "submit-btn"
        onClick = { fetchPlacementData } > Submit < /button>

        {
            placementData.length > 0 && labels.length > 0 && ( <
                div className = "monitoring-chart" >
                <
                Bar data = { chartData }
                options = { options }
                plugins = {
                    [ChartDataLabels] }
                /> <
                /div>
            )
        } <
        /div>
    );
}

export default Monitoring;