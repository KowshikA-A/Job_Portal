import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import VerticalNavBar from './components/VerticalNavBar';
import Stats from './components/Stats';
import CompanyList from './components/CompanyList';
import StudentList from './components/StudentList';
import About from './components/About';
import Contact from './components/contact';
import Monitoring from './components/LessData';
import MoreData from './components/MoreData';
import Login from './components/Login';
import Register from './components/Register';
import YearlyPlacedStudentsChart from './components/YearlyPlacedStudentsChart';
import CompanyPlacementsChart from './components/CompanyPlacementsChart';
import CTCChart from './components/CTCChart'; // Import the CTC Chart component
import ProtectedRoute from './components/ProtectedRoute';
import Upload from './components/UploadPage';
import JobNotifications from './components/JobNotifications';
import './styles/App.css';
import axios from 'axios';

function App() {
    const [filter, setFilter] = useState('all');
    const [year, setYear] = useState(null);
    const [showCompanyList, setShowCompanyList] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    const handleSearch = (term) => setSearchTerm(term);

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        setShowCompanyList(newFilter === 'Companies Visited');
    };

    const handleYearChange = (newYear) => setYear(Number(newYear));

    const toggleCompanyList = () => setShowCompanyList((prev) => !prev);

    axios.defaults.withCredentials = true;

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post('https://job-portalapi.vercel.app/login', { name, password })
            .then(result => {
                console.log(result);
            })
            .catch(err => {
                console.error(err);
            });
    };

    return (
        <div className="app-layout">
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes */}
                <Route
                    path="/"
                    element={
                        <ProtectedRoute
                            element={
                                <div className="content-layout">
                                    <Navbar onSearch={handleSearch} />
                                    <div className="main-content">
                                        <VerticalNavBar
                                            onFilterChange={handleFilterChange}
                                            onYearChange={handleYearChange}
                                            toggleCompanyList={toggleCompanyList}
                                            showCompanyList={showCompanyList}
                                        />
                                        <div className="results-container">
                                            {filter === 'all' && !showCompanyList && <Stats />}
                                            {showCompanyList && <CompanyList year={year} />}
                                            {filter !== 'Companies Visited' &&
                                                filter !== 'all' &&
                                                !showCompanyList && (
                                                    <StudentList
                                                        filter={filter}
                                                        year={year}
                                                        searchTerm={searchTerm}
                                                    />
                                                )}
                                        </div>
                                        <div className="charts-container">
                                            {filter === 'all' && !showCompanyList && (
                                                <>
                                                    <CTCChart />
                                                    <h3>
                                                        <strong className="red-text">Directions:</strong> Choose the
                                                        year on the left to view Company-wise placements.
                                                    </h3>
                                                    {year && <CompanyPlacementsChart year={year} />}
                                                    <YearlyPlacedStudentsChart />
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            }
                        />
                    }
                />
                <Route
                    path="/about"
                    element={
                        <ProtectedRoute
                            element={
                                <>
                                    <Navbar onSearch={handleSearch} />
                                    <About />
                                </>
                            }
                        />
                    }
                />
                <Route
                    path="/contact"
                    element={
                        <ProtectedRoute
                            element={
                                <>
                                    <Navbar onSearch={handleSearch} />
                                    <Contact />
                                </>
                            }
                        />
                    }
                />
                <Route
                    path="/upload"
                    element={
                        <ProtectedRoute
                            element={
                                <>
                                    <Navbar onSearch={handleSearch} />
                                    <Upload />
                                </>
                            }
                        />
                    }
                />
                <Route
                    path="/monitoring"
                    element={
                        <ProtectedRoute
                            element={
                                <>
                                    <Navbar onSearch={handleSearch} />
                                    <Monitoring />
                                </>
                            }
                        />
                    }
                />
                <Route
                    path="/monitoring/less-data"
                    element={
                        <ProtectedRoute
                            element={
                                <>
                                    <Navbar onSearch={handleSearch} />
                                    <Monitoring />
                                </>
                            }
                        />
                    }
                />
                <Route
                    path="/monitoring/more-data"
                    element={
                        <ProtectedRoute
                            element={
                                <>
                                    <Navbar onSearch={handleSearch} />
                                    <MoreData />
                                </>
                            }
                        />
                    }
                />
                <Route
                    path="/job-notifications"
                    element={
                        <ProtectedRoute
                            element={
                                <>
                                    <Navbar onSearch={handleSearch} />
                                    <JobNotifications />
                                </>
                            }
                        />
                    }
                />
            </Routes>

            <footer className="footer10">
                <p className="footer">
                    Copyright: {new Date().getFullYear()} Career Development Center, VIT - AP University
                </p>
            </footer>
        </div>
    );
}
export default App;

