import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import './CompanyList.css';

const CompanyList = ({ year }) => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCompanies = useCallback(async() => {
        if (!year) return;

        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`http://localhost:1000/api/companies?year=${year}`);
            console.log(response.data);
            setCompanies(response.data);
        } catch (error) {
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                setError(`Error: ${error.response.data.message || 'Failed to fetch companies.'}`);
            } else if (error.request) {
                console.error('Request data:', error.request);
                setError('No response received from the server.');
            } else {
                console.error('Error message:', error.message);
                setError('Error setting up request.');
            }
        } finally {
            setLoading(false);
        }
    }, [year]);

    useEffect(() => {
        fetchCompanies();
    }, [fetchCompanies]);

    return ( <
        div className = "company-list" >
        <
        h2 > Companies Visited in { year } < /h2> {
        loading && < p > Loading... < /p>} {
        error && < p style = {
            { color: 'red' }
        } > { error } < /p>} <
        div className = "company-list-items" > {
            companies.length > 0 ? (
                companies.map((company) => ( <
                    div key = { company.id || `${company.name}-${company.placedCount}` }
                    className = "company-card" >
                    <
                    h3 > { company.name } < /h3> <
                    p > Placed: { company.placedCount } < /p> < /
                    div >
                ))
            ) : ( <
                p > No companies found
                for this year. < /p>
            )
        } <
        /div> < /
        div >
    );
};

export default CompanyList;