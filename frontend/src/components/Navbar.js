import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';
import logo from './logo.png';

function Navbar({ onSearch }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const isLoggedIn = !!localStorage.getItem('authToken');

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (onSearch) {
            onSearch(value);
        }
    };

    const handleHomeClick = (e) => {
        e.preventDefault();
        navigate('/');
    };

    const handleAboutClick = (e) => {
        e.preventDefault();
        navigate('/about');

    };

    const handleContactClick = (e) => {
        e.preventDefault();
        navigate('/contact');
    };

    const handleMonitoringClick = (e) => {
        e.preventDefault();
        setIsDropdownOpen((prev) => !prev);

    };

    const handleLessDataClick = (e) => {
        e.preventDefault();
        navigate('/monitoring/less-data');
        setIsDropdownOpen(false);
    };

    const handleMoreDataClick = (e) => {
        e.preventDefault();
        navigate('/monitoring/more-data');
        setIsDropdownOpen(false);
    };

    const handleUploadClick = (e) => {
        e.preventDefault();
        navigate('/upload');
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    return ( <
            nav className = "navbar" >
            <
            img src = { logo }
            alt = "Logo"
            className = "navbar-logo" / >
            <
            ul className = "navbar-menu" > {
                isLoggedIn && ( <
                    >
                    <
                    li >
                    <
                    a href = "/"
                    onClick = { handleHomeClick }
                    className = { location.pathname === '/' ? 'active' : '' } >
                    Home <
                    /a> < /
                    li > <
                    li >
                    <
                    a href = "/upload"
                    onClick = { handleUploadClick }
                    className = { location.pathname === '/upload' ? 'active' : '' } >
                    Data Upload <
                    /a> < /
                    li > <
                    li >
                    <
                    a href = "/monitoring"
                    onClick = { handleMonitoringClick }
                    className = { location.pathname.includes('/monitoring') ? 'active' : '' } >
                    Monitor <
                    /a> {
                    isDropdownOpen && ( <
                        ul className = "dropdown-menu" >
                        <
                        li >
                        <
                        a href = "/monitoring/less-data"
                        onClick = { handleLessDataClick } >
                        Compare Less Data <
                        /a> < /
                        li > <
                        li >
                        <
                        a href = "/monitoring/more-data"
                        onClick = { handleMoreDataClick } >
                        Compare More Data <
                        /a> < /
                        li > <
                        /ul>
                    )
                } <
                /li> <
                li >
                <
                a href = "/about"
                onClick = { handleAboutClick }
                className = { location.pathname === '/about' ? 'active' : '' } >
                About <
                /a> < /
                li > <
                li >
                <
                a href = "/contact"
                onClick = { handleContactClick }
                className = { location.pathname === '/contact' ? 'active' : '' } >
                Contact <
                /a> < /
                li > <
                />
            )
        } <
        /ul> <
    div className = "navbar-search" >
        <
        input type = "text"
    placeholder = "Search by Registration Number"
    value = { searchTerm }
    onChange = { handleSearchChange }
    /> < /
    div > {
            isLoggedIn && ( <
                button className = "logout-button"
                onClick = { handleLogout } >
                Logout <
                /button>
            )
        } <
        /nav>
);
}

export default Navbar;