import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import './StudentDetailModal.css';

const statusStyles = {
    Applied: { color: 'black', backgroundColor: 'white' },
    Shortlisted: { color: 'orange', backgroundColor: 'white' },
    'Not placed': { color: 'red', backgroundColor: 'white' },
    Placed: { color: 'green', backgroundColor: 'white' },
};

const StudentDetailModal = ({ student, onClose }) => {
    if (!student) return null;

    return ( <
            div className = "modal-overlay" >
            <
            div className = "modal-content" >
            <
            FontAwesomeIcon icon = { faCircleXmark }
            onClick = { onClose }
            className = "close-icon" /
            >
            <
            h1 > STUDENT DETAILS < /h1> <
            div className = "student-details" >
            <
            p className = "even" >
            <
            strong > Name: < /strong> {student.Name} < /
            p > <
            p className = "even" >
            <
            strong > Reg No: < /strong> {student.Reg_No} < /
            p > <
            p className = "even" >
            <
            strong > School: < /strong> {student.School} < /
            p > <
            p className = "even" >
            <
            strong > Year: < /strong> {student.Year} < /
            p > <
            /div> <
            h3 > Applications: < /h3> {
            student.Applications && student.Applications.length > 0 ? ( <
                div className = "applications-list" > {
                    student.Applications.map((app, index) => ( <
                        div key = { index }
                        style = {
                            { margin: '5px 0' }
                        } >
                        <
                        strong className = "even" > Company: < /strong> {app.Company} <
                        span style = {
                            {
                                color: statusStyles[app.ApplicationStatus].color,
                                backgroundColor: statusStyles[app.ApplicationStatus].backgroundColor,
                                padding: '5px 10px',
                                borderRadius: '15px',
                                marginLeft: '10px',
                                fontWeight: 'bold',
                            }
                        } >
                        ({
                            app.ApplicationStatus === 'Placed' ?
                            `${app.ApplicationStatus}, ${app.CTC}, ${app.Category}` : `${app.ApplicationStatus}, ${app.Category}`
                        }) <
                        /span> < /
                        div >
                    ))
                } <
                /div>
            ) : ( <
                p > No applications found
                for this student. < /p>
            )
        } <
        /div> < /
    div >
);
};

export default StudentDetailModal;