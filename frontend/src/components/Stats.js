import React, { useEffect, useState } from 'react';
import './Stats.css';

const Stats = () => {
    const [error, setError] = useState(null);
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async() => {
            try {
                const response = await fetch('http://localhost:1000/api/stats');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const jsonData = await response.json();
                setData(jsonData);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchData();
    }, []);

    return ( <
        div className = "stats-container" > {
            error && < p className = "error-message" > Error fetching data: { error } < /p>} {
            data.length > 0 ? ( <
                >
                <
                p className = "description" >
                <
                strong className = "red-text" > Description: < /strong> Displays total students, placed students, not placed students, and the highest CTC with top student information. < /
                p > {
                    data.map((item, index) => ( <
                        div key = { index }
                        className = "stats-card" >
                        <
                        h4 className = "year" > Year: { item.year } < /h4> <
                        p className = "total-students" >
                        Total Students: < span > { item.total } < /span> < /
                        p > <
                        p className = "placed" >
                        Placed: < span > { item.placed } < /span> < /
                        p > <
                        p className = "max-ctc" >
                        Highest CTC: < span > < strong > { item.maxCTC }
                        LPA < /strong></span >
                        <
                        /p>  < /
                        div >
                    ))
                } <
                />
            ) : ( <
                p > No data available < /p>
            )
        } <
        /div>
    );
};

export default Stats;