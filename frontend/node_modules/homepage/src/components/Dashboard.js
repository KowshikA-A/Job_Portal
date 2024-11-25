import React, { useState } from 'react';
import VerticalNavBar from './VerticalNavBar';
import StudentList from './StudentList';
import CompanyPlacementsChart from './CompanyPlacementsChart'; // The chart component

function Dashboard() {
    const [filter, setFilter] = useState('All Students');
    const [year, setYear] = useState('');
    const [showChart, setShowChart] = useState(false); // New state to control chart visibility

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        // Only show the chart when 'Stats' filter is applied
        if (newFilter === 'Stats') {
            setShowChart(true);
        } else {
            setShowChart(false); // Hide the chart for other filters
        }
    };

    const handleYearChange = (newYear) => {
        setYear(newYear);
    };

    return ( <
            div >
            <
            VerticalNavBar onFilterChange = { handleFilterChange }
            onYearChange = { handleYearChange }
            />

            { /* Conditionally render chart only when the Stats filter is applied */ } {
                showChart && < CompanyPlacementsChart year = { year }
                />}

                { /* Render StudentList for other filters */ } {
                    !showChart && < StudentList filter = { filter }
                    year = { year }
                    />} <
                    /div>
                );
            }

            export default Dashboard;