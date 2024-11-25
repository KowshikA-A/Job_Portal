import React, { useEffect, useState } from 'react';
import './Stats.css'; // Ensure you have corresponding CSS styles

const Stats = () => {
        const [data, setData] = useState([]);
        const [error, setError] = useState(null);

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
                error && < p > Error fetching data: { error } < /p>} {
                    data.length > 0 ? (
                        data.map((item, index) => ( <
                            div key = { index }
                            className = "stats-card" >
                            <
                            h3 > { item.year } < /h3> <
                            p > Total Students: { item.total } < /p> <
                            p > Placed: { item.placed } < /p> <
                            p > Not Placed: { item.notPlaced } < /p> <
                            /div>
                        ))
                    ) : ( <
                        p > No data available < /p>
                    )
                } <
                /div>
            );
        };

        export default Stats;