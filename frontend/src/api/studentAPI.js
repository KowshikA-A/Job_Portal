import axios from 'axios';

export const fetchStudents = async(filter, year, searchTerm, school, type) => {
    try {
        const response = await axios.get('http://localhost:1000/api/students', {
            params: {
                filter,
                year,
                searchTerm,
                school,
                type
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching students:", error);
        throw new Error('Failed to fetch student data');
    }
};