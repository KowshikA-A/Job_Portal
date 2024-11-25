// App.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import VerticalNavBar from './components/VerticalNavBar';
import Stats from './components/Stats';
import CompanyList from './components/CompanyList';
import StudentList from './components/StudentList';
import About from './components/About';
import Contact from './components/contact'; // Ensure correct casing
import Login from './components/Login';
import Register from './components/Register';
import YearlyPlacedStudentsChart from './components/YearlyPlacedStudentsChart';
import CompanyPlacementsChart from './components/CompanyPlacementsChart';
import YearFilter from './components/YearFilter';
import ProtectedRoute from './components/ProtectedRoute'; // Import the ProtectedRoute component
import './styles/App.css';

function App() {
    const [filter, setFilter] = React.useState('all');
    const [year, setYear] = React.useState(null);
    const [showCompanyList, setShowCompanyList] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState('');

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        setShowCompanyList(newFilter === 'Companies Visited');
    };

    const handleYearChange = (newYear) => {
        setYear(Number(newYear)); // Ensure year is an integer
    };

    const toggleCompanyList = () => {
        setShowCompanyList((prev) => !prev);
    };

    return ( <
        div className = "app-layout" >
        <
        Routes >
        <
        Route path = "/login"
        element = { < Login / > }
        /> <
        Route path = "/register"
        element = { < Register / > }
        /> <
        Route path = "/"
        element = { <
            ProtectedRoute
            element = { <
                div className = "content-layout" >
                <
                Navbar onSearch = { handleSearch }
                /> <
                div className = "main-content" >
                <
                VerticalNavBar
                onFilterChange = { handleFilterChange }
                onYearChange = { handleYearChange }
                toggleCompanyList = { toggleCompanyList }
                showCompanyList = { showCompanyList }
                /> <
                div className = "results-container" > { filter === 'all' && !showCompanyList && < Stats / > } {
                    showCompanyList && < CompanyList year = { year }
                    />} {!showCompanyList && filter !== 'Companies Visited' && filter !== 'all' && ( <
                    StudentList filter = { filter }
                    year = { year }
                    searchTerm = { searchTerm }
                    />
                )
            } <
            /div> <
            div className = "charts-container" > {
                filter === 'all' && !showCompanyList && ( <
                    >
                    <
                    YearFilter selectedYear = { year }
                    onYearChange = { handleYearChange }
                    /> {
                    year && < CompanyPlacementsChart year = { year }
                    />} <
                    YearlyPlacedStudentsChart / >
                    <
                    />
                )
            } <
            /div> < /
            div > <
            /div>
        }
        />
    }
    /> <
    Route path = "/about"
    element = { < ProtectedRoute element = { < > < Navbar onSearch = { handleSearch } /><About / > < />} / > }
        /> <
        Route path = "/contact"
        element = { < ProtectedRoute element = { < > < Navbar onSearch = { handleSearch } /><Contact / > < />} / > }
            /> < /
            Routes > { /* Footer with copyright notice */ } <
            footer className = "footer" >
            <
            p >
            Copyright: { new Date().getFullYear() }
            Career Development Center,
            VIT - AP University <
            /p> < /
            footer > <
            /div>
        );
    }

    export default App;