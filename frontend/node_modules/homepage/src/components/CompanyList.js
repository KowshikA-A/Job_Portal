import React, { useState, useEffect } from 'react';
import './CompanyList.css';

function CompanyList({ year }) {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCompanies = async() => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`http://localhost:1000/api/companies?year=${year}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log('Fetched companies:', data); // Debugging output
                setCompanies(data);
            } catch (error) {
                console.error('Error fetching company data:', error); // Debugging output
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCompanies();
    }, [year]);

    if (loading) {
        return <p > Loading... < /p>;
    }

    if (error) {
        return <p > Error: { error } < /p>;
    }

    return ( <
        div className = "company-list" >
        <
        h2 > Companies Visited < /h2> <
        div className = "company-list-items" > {
            companies.length > 0 ? (
                companies.map((company, index) => ( <
                    div key = { company.name + index }
                    className = "company-card" >
                    <
                    h3 > { company.name } < /h3> <
                    p > Total Students Placed: { company.placedCount } < /p> < /
                    div >
                ))
            ) : ( <
                p > No companies found < /p>
            )
        } <
        /div> < /
        div >
    );
}

export default CompanyList;