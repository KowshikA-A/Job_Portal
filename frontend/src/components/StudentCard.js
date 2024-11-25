import React from 'react';
import './StudentCard.css';

function StudentCard({ student }) {
    console.log('Student data in StudentCard:', student);

    if (!student) {
        return <div > Invalid student data < /div>;
    }

    const applications = student.Applications || [];

    const getStatusColor = (applications) => {
        if (applications.some(app => app.ApplicationStatus === 'Placed')) {
            return { background: '#9ae59a', border: 'green' };
        } else if (applications.some(app => app.ApplicationStatus === 'Shortlisted')) {
            return { background: '#ffc266', border: 'orange' };
        } else if (applications.some(app => app.ApplicationStatus === 'Not placed')) {
            return { background: '#ff8080', border: 'red' };
        } else if (applications.some(app => app.ApplicationStatus === 'Applied')) {
            return { background: 'white', border: 'white' };
        }
        return { background: '#ffffff', border: '#dee2e6' };
    };

    const { background, border } = getStatusColor(applications);

    return ( <
        div className = "student-card-container" >
        <
        div className = "student-card"
        style = {
            {
                backgroundColor: background,
                borderColor: border,
                transition: 'all 0.3s ease',
            }
        } >
        <
        h3 > { student.Name } < /h3> <
        p > Reg No: { student.Reg_No } < /p> <
        p > School: { student.School } < /p> < /
        div > <
        div className = "tooltipp" > Click to view full details < /div> < /
        div >
    );
}

export default StudentCard;