import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './VerticalNavBar.css';
import { Link } from 'react-router-dom';

function VerticalNavBar({
    onFilterChange,
    onYearChange,
    toggleCompanyList,
    showCompanyList,
}) {
    const [tooltip, setTooltip] = useState('');
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
    const [years, setYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async() => {
            try {
                const response = await axios.get('/api/filters');
                if (response.data) {
                    const { years } = response.data;
                    if (Array.isArray(years)) setYears(years);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching filter data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleMouseEnter = (text, event) => {
        setTooltip(text);
        const { top, left, height } = event.currentTarget.getBoundingClientRect();
        setTooltipPosition({ top: top + height + window.scrollY, left: left + window.scrollX });
    };

    const handleMouseLeave = () => {
        setTooltip('');
    };

    const handleYearChange = (event) => {
        const selectedYear = event.target.value;
        setSelectedYear(selectedYear);
        onYearChange(selectedYear);
    };

    const handleCompaniesVisitedClick = () => {
        if (!selectedYear) {
            alert('Please select a year before viewing the companies list.');
            return;
        }
        toggleCompanyList();
    };

    if (loading) {
        return <div > Loading filters... < /div>;
    }

    return ( <
        div className = "vertical-nav" >
        <
        button onClick = {
            () => onFilterChange('All Students') }
        onMouseEnter = {
            (e) =>
            handleMouseEnter('View all students regardless of placement status.', e)
        }
        onMouseLeave = { handleMouseLeave } >
        All Students <
        /button>

        <
        button onClick = {
            () => onFilterChange('Placed') }
        onMouseEnter = {
            (e) =>
            handleMouseEnter('View only the students who have been placed.', e)
        }
        onMouseLeave = { handleMouseLeave } >
        Placed Students <
        /button>

        <
        button onClick = {
            () => onFilterChange('Not placed') }
        onMouseEnter = {
            (e) =>
            handleMouseEnter('View students who have not been placed.', e)
        }
        onMouseLeave = { handleMouseLeave } >
        Not Placed Students <
        /button>

        <
        select onChange = { handleYearChange }
        onMouseEnter = {
            (e) =>
            handleMouseEnter('Select a year to filter students by their application year.', e)
        }
        onMouseLeave = { handleMouseLeave } >
        <
        option value = "" > Select Year < /option> {
            years.length > 0 ? (
                years.map((year, index) => ( <
                    option key = { index }
                    value = { year } >
                    Year { year } <
                    /option>
                ))
            ) : ( <
                option disabled > No years available < /option>
            )
        } <
        /select>

        <
        button onClick = { handleCompaniesVisitedClick }
        onMouseEnter = {
            (e) =>
            handleMouseEnter(
                showCompanyList ?
                'Hide the list of companies visited.' :
                'Show the list of companies visited.',
                e
            )
        }
        onMouseLeave = { handleMouseLeave } >
        { showCompanyList ? 'Hide Companies' : 'Companies Visited' } <
        /button>

        <
        Link to = "/job-notifications"
        className = "nav-link"
        onMouseEnter = {
            (e) => handleMouseEnter('View job notifications.', e) }
        onMouseLeave = { handleMouseLeave } >
        Job Notifications <
        /Link>

        {
            tooltip && ( <
                div className = "tooltip"
                style = {
                    { top: tooltipPosition.top, left: tooltipPosition.left } } > { tooltip } <
                /div>
            )
        } <
        /div>
    );
}

export default VerticalNavBar;