// src/components/YearFilter.js
import React from 'react';

function YearFilter({ selectedYear, onYearChange }) {
    const years = [2021, 2022, 2023, 2024, 2025]; // Adjust based on available years

    return ( <
            div className = "year-filter" >
            <
            select id = "year"
            value = { selectedYear || '' }
            onChange = {
                (e) => onYearChange(e.target.value)
            } >
            <
            option value = ""
            disabled > Select the Year < /option> {
            years.map((year) => ( <
                option key = { year }
                value = { year } > { year } <
                /option>
            ))
        } <
        /select> < /
    div >
);
}

export default YearFilter;