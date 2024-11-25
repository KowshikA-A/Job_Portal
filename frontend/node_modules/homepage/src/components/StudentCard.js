import React from 'react';
import './StudentCard.css';

function StudentCard({ student }) {
    console.log('Student data in StudentCard:', student);

    if (!student) {
        return <div > Invalid student data < /div>;
    }

    // Ensure Companies and Statuses are arrays
    const companies = student.Companies || [];
    const statuses = student.Statuses || [];

    const statusClass = statuses.includes('Placed') ? 'placed' :
        statuses.includes('Not Placed') ? 'not-placed' :
        statuses.includes('Shortlisted') ? 'shortlisted' :
        '';

    const statusColor = statusClass === 'placed' ?
        '#d4edda' :
        statusClass === 'not-placed' ?
        '#f8d7da' :
        statusClass === 'shortlisted' ?
        '#fff3cd' :
        '#f8f9fa';

    return ( <
        div className = { `student-card ${statusClass}` }
        style = {
            { '--hover-color': statusColor } } >
        <
        h3 > { student.Name } < /h3> <
        p > Reg No: { student.Reg_No } < /p> <
        p > Year: { student.Year } < /p> <
        div className = "student-companies" >
        <
        ul > {
            companies.map((company, index) => ( <
                li key = { index } >
                <
                strong > { company } < /strong>: {statuses[index]} <
                /li>
            ))
        } <
        /ul> <
        /div> <
        /div>
    );
}

export default StudentCard;