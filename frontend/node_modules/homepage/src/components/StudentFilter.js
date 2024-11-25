import React from 'react';

function StudentFilter({ setFilter, setYear, year }) {
    return (
        <div>
            <button onClick={() => setFilter('all')}>All Students</button>
            <button onClick={() => setFilter('placed')}>Placed Students</button>
            <button onClick={() => setFilter('notPlaced')}>Not Placed Students</button>

            <select value={year} onChange={(e) => setYear(e.target.value)}>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2026</option>

            </select>
        </div>
    );
}

export default StudentFilter;
