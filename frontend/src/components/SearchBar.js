import React, { useState } from 'react';

function SearchBar({ onSearch }) {
    const [searchInput, setSearchInput] = useState('');

    const handleChange = (e) => {
        setSearchInput(e.target.value);
    };

    const handleSearch = () => {
        onSearch(searchInput);
    };

    return ( <
        div className = "search-bar" >
        <
        input type = "text"
        value = { searchInput }
        onChange = { handleChange }
        placeholder = "Search by Reg No" /
        >
        <
        button onClick = { handleSearch } > Search < /button> < /
        div >
    );
}

export default SearchBar;