import React, { useState, useEffect } from 'react';
import StudentCard from './StudentCard';
import './StudentList.css';
import { fetchStudents } from '../api/studentAPI';
import { groupByRegNo } from '../utils/groupByRegNo';

function StudentList({ filter, year, searchTerm }) {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // New error state

    useEffect(() => {
        const loadStudents = async() => {
            try {
                setLoading(true); // Start loading before the request
                const data = await fetchStudents(filter, year, searchTerm);

                if (Array.isArray(data)) {
                    const groupedData = groupByRegNo(data);
                    setStudents(groupedData);
                } else {
                    console.error('Fetched data is not an array:', data);
                    setError('Unexpected data format from server.');
                }
            } catch (error) {
                console.error('Error loading students:', error);
                setError('Failed to load student data.');
            } finally {
                setLoading(false); // Stop loading after the request is done
            }
        };

        loadStudents();
    }, [filter, year, searchTerm]);

    if (loading) {
        return <p > Loading... < /p>; 
    }

    if (error) {
        return <p className = "error-message" > { error } < /p>; 
    }

    return ( <
        div className = "student-list" >
        <
        h2 style = {
            { marginLeft: '20px', fontSize: '30px' }
        } > Students < /h2> <
        div className = "student-cards-container" > {
            students.length > 0 ? (
                students.map(student => ( <
                    StudentCard key = { student.Reg_No }
                    student = { student }
                    />
                ))
            ) : ( <
                p > No students found matching this criteria. < /p>
            )
        } <
        /div> < /
        div >
    );
}

export default StudentList;