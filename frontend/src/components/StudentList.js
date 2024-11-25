import React, { useState, useEffect } from 'react';
import StudentCard from './StudentCard';
import StudentDetailModal from './StudentDetailModal';
import './StudentList.css';
import { fetchStudents } from '../api/studentAPI';
import { groupByRegNo } from '../utils/groupByRegNo';

function StudentList({ filter, year, searchTerm }) {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [schoolFilter, setSchoolFilter] = useState('');
    const [selectedButton, setSelectedButton] = useState(null);
    const [hoveredButton, setHoveredButton] = useState('');

    useEffect(() => {
        const loadStudents = async() => {
            setLoading(true);
            setError(null);

            try {
                const data = await fetchStudents(filter, year, searchTerm, schoolFilter);

                if (Array.isArray(data)) {
                    if (data.length === 0) {
                        setStudents([]);
                        setError('No students found matching this criteria.');
                    } else {
                        const groupedData = groupByRegNo(data);

                        const filteredStudents = Object.values(groupedData)
                            .flat()
                            .filter((student) => {
                                const matchesSchool = schoolFilter ?
                                    student.School && student.School.toLowerCase() === schoolFilter.toLowerCase() :
                                    true;
                                const matchesYear = year ? student.Year === year : true;
                                return matchesSchool && matchesYear;
                            });

                        setStudents(filteredStudents);
                    }
                } else {
                    console.error('Fetched data is not an array:', data);
                    setStudents([]);
                    setError('Unexpected data format from server.');
                }
            } catch (error) {
                console.error('Error loading students:', error);
                setError('Failed to load student data.');
            } finally {
                setLoading(false);
            }
        };

        loadStudents();
    }, [filter, year, searchTerm, schoolFilter]);

    const handleStudentClick = (student) => {
        setSelectedStudent(student);
    };

    const closeModal = () => {
        setSelectedStudent(null);
    };

    const handleSchoolFilterChange = (school) => {
        setSchoolFilter(school);
        setSelectedButton(school);
    };

    const clearSchoolFilter = () => {
        setSchoolFilter('');
        setSelectedButton(null);
        setHoveredButton('');
    };

    const handleMouseEnter = (school) => {
        setHoveredButton(school);
    };

    const handleMouseLeave = () => {
        setHoveredButton('');
    };

    if (loading) {
        return <div className = "loading-spinner" > Loading... < /div>;
    }

    if (error) {
        return <p className = "error-message" > { error } < /p>;
    }

    return ( <
            div className = "student-list" >
            <
            h2 style = {
                { marginLeft: '20px', fontSize: '30px' }
            } > Students < /h2>

            <
            div className = "button-container"
            style = {
                { marginLeft: '20px', marginBottom: '20px' }
            } >
            <
            button className = { `student-filter-button ${selectedButton === 'SCOPE' ? 'selected' : ''}` }
            onClick = {
                () => handleSchoolFilterChange('SCOPE')
            }
            onMouseEnter = {
                () => handleMouseEnter('SCOPE')
            }
            onMouseLeave = { handleMouseLeave } >
            SCOPE {
                hoveredButton === 'SCOPE' && < div className = "tooltip" > Filter students from the SCOPE school < /div>} < /
                button >

                    <
                    button
                className = { `student-filter-button ${selectedButton === 'SENSE' ? 'selected' : ''}` }
                onClick = {
                    () => handleSchoolFilterChange('SENSE')
                }
                onMouseEnter = {
                    () => handleMouseEnter('SENSE')
                }
                onMouseLeave = { handleMouseLeave } >
                    SENSE {
                        hoveredButton === 'SENSE' && < div className = "tooltip" > Filter students from the SENSE school < /div>} < /
                        button >

                            <
                            button
                        className = { `student-filter-button ${selectedButton === 'SMEC' ? 'selected' : ''}` }
                        onClick = {
                            () => handleSchoolFilterChange('SMEC')
                        }
                        onMouseEnter = {
                            () => handleMouseEnter('SMEC')
                        }
                        onMouseLeave = { handleMouseLeave } >
                            SMEC {
                                hoveredButton === 'SMEC' && < div className = "tooltip" > Filter students from the SMEC school < /div>} < /
                                button >

                                    <
                                    button
                                className = "student-filter-button clear-filter-button"
                                onClick = { clearSchoolFilter }
                                onMouseEnter = {
                                    () => handleMouseEnter('Clear')
                                }
                                onMouseLeave = { handleMouseLeave } >
                                    Clear Filter {
                                        hoveredButton === 'Clear' && < div className = "tooltip" > Clear all school filters < /div>} < /
                                        button > <
                                            /div>

                                        <
                                        div className = "student-cards-container" > {
                                                students.length === 0 ? ( <
                                                    p > No students found matching this criteria. < /p>
                                                ) : (
                                                    students.map((student) => ( <
                                                        div key = { student.Reg_No }
                                                        onClick = {
                                                            () => handleStudentClick(student)
                                                        } >
                                                        <
                                                        StudentCard student = { student }
                                                        /> < /
                                                        div >
                                                    ))
                                                )
                                            } <
                                            /div>

                                        {
                                            selectedStudent && < StudentDetailModal student = { selectedStudent }
                                            onClose = { closeModal }
                                            />} < /
                                            div >
                                        );
                                    }

                                export default StudentList;