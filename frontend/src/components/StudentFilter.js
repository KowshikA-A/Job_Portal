import React, { useState, useEffect } from 'react';

function StudentFilter({ setSchoolFilter, setTypeFilter, setYear, year }) {
    const [school, setSchool] = useState('');
    const [type, setType] = useState('');

    useEffect(() => {
        setSchoolFilter(school);
    }, [school, setSchoolFilter]);

    useEffect(() => {
        setTypeFilter(type);
    }, [type, setTypeFilter]);

    return ( <
        div > { /* Filter by year */ } <
        select value = { year }
        onChange = {
            (e) => setYear(e.target.value) } >
        <
        option value = "" > Select Year < /option> <
        option value = "2023" > 2023 < /option> <
        option value = "2024" > 2024 < /option> <
        option value = "2025" > 2025 < /option> <
        option value = "2026" > 2026 < /option> <
        option value = "2027" > 2027 < /option> <
        /select>

        { /* Optional filters for school */ } <
        select value = { school }
        onChange = {
            (e) => setSchool(e.target.value) } >
        <
        option value = "" > Select School < /option> <
        option value = "SMEC" > SMEC < /option> <
        option value = "SCOPE" > SCOPE < /option> <
        option value = "SENSE" > SENSE < /option> <
        /select>

        { /* Optional filters for type */ } <
        select value = { type }
        onChange = {
            (e) => setType(e.target.value) } >
        <
        option value = "" > Select Type < /option> <
        option value = "Super dream internship" > Super dream internship < /option> <
        option value = "Super dream offer" > Super dream offer < /option> <
        option value = "Dream offer" > Dream offer < /option> <
        option value = "Dream internship" > Dream internship < /option> <
        option value = "Restricted dream" > Restricted dream < /option> <
        /select> <
        /div>
    );
}

export default StudentFilter;