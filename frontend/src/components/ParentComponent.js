import React, { useState, useEffect } from 'react';
import { fetchStudents } from './api/fetchStudents';
import SearchBar from './common/SearchBar';
import StudentList from './students/StudentList';
import VerticalNavBar from './VerticalNavBar';

function ParentComponent() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [year, setYear] = useState('');
    const [school, setSchool] = useState('');
    const [type, setType] = useState('');
    const [schools, setSchools] = useState([]);
    const [types, setTypes] = useState([]);
    const [students, setStudents] = useState([]);
    const [showCompanyList, setShowCompanyList] = useState(false);
    const toggleCompanyList = () => {
        setShowCompanyList(prevState => !prevState);
    };

    useEffect(() => {
        const fetchData = async() => {
            try {
                console.log("Fetching data with filters: ", { filter, year, searchTerm, school, type });

                const data = await fetchStudents(filter, year, searchTerm, school, type);
                setStudents(data);

                const uniqueSchools = [...new Set(data.map(student => student.school))];
                const uniqueTypes = [...new Set(data.map(student => student.type))];

                setSchools(uniqueSchools);
                setTypes(uniqueTypes);
            } catch (error) {
                console.error('Error fetching students:', error);
            }
        };

        fetchData();
    }, [searchTerm, filter, year, school, type]);

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
    };

    const handleYearChange = (newYear) => {
        setYear(newYear);
    };

    const handleSchoolChange = (newSchool) => {
        setSchool(newSchool);
        console.log("School changed to:", newSchool);
    };

    const handleTypeChange = (newType) => {
        setType(newType);
        console.log("Type changed to:", newType);
    };

    return ( <
        div >
        <
        SearchBar onSearch = { handleSearch }
        /> <
        VerticalNavBar onFilterChange = { handleFilterChange }
        onYearChange = { handleYearChange }
        onTypeChange = { handleTypeChange }
        onSchoolChange = { handleSchoolChange }
        toggleCompanyList = { toggleCompanyList }
        showCompanyList = { showCompanyList }
        setSchoolFilter = { setSchoolFilter }
        schools = { schools }
        types = { types }
        /> <
        StudentList students = { students }
        /> < /
        div >
    );
}

export default ParentComponent;