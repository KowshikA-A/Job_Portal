import React, { useState } from 'react';
import VerticalNavBar from './VerticalNavBar';
import StudentList from './StudentList';
import CompanyPlacementsChart from './CompanyPlacementsChart';

function Dashboard() {
    const [filter, setFilter] = useState('All Students');
    const [year, setYear] = useState('');
    const [showChart, setShowChart] = useState(false);

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);

        if (newFilter === 'Stats') {
            setShowChart(true);
        } else {
            setShowChart(false);
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
                    />} < /
                    div >
                );
            }

            export default Dashboard;