// src/components/ParentComponent.js
import React, { useState } from 'react';
import SearchBar from './common/SearchBar';
import StudentList from './students/StudentList';

function ParentComponent() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [year, setYear] = useState('');

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
    };

    const handleYearChange = (newYear) => {
        setYear(newYear);
    };

    return ( <
        div >
        <
        SearchBar onSearch = { handleSearch }
        /> <
        StudentList filter = { filter }
        year = { year }
        searchTerm = { searchTerm }
        /> < /
        div >
    );
}

export default ParentComponent;