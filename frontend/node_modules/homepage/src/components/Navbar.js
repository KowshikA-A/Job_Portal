import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';
import logo from './logo.png';

function Navbar({ onSearch }) {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const location = useLocation(); // Get the current location
    const isLoggedIn = !!localStorage.getItem('authToken'); // Check if user is logged in

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (onSearch) {
            onSearch(value);
        }
    };

    const handleHomeClick = (e) => {
        e.preventDefault(); // Prevent default anchor behavior
        navigate('/'); // Navigate to home page
    };

    const handleAboutClick = (e) => {
        e.preventDefault(); // Prevent default anchor behavior
        navigate('/about'); // Navigate to about page
    };

    const handleContactClick = (e) => {
        e.preventDefault(); // Prevent default anchor behavior
        navigate('/contact'); // Navigate to contact page
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken'); // Remove token to log out
        navigate('/login'); // Redirect to login page
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
                className = { location.pathname === '/' ? 'active' : '' } > Home < /a> <
                /li> <
                li >
                <
                a href = "/about"
                onClick = { handleAboutClick }
                className = { location.pathname === '/about' ? 'active' : '' } > About < /a> <
                /li> <
                li >
                <
                a href = "/contact"
                onClick = { handleContactClick }
                className = { location.pathname === '/contact' ? 'active' : '' } > Contact < /a> <
                /li> <
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
        /> <
        /div> {
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