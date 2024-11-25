import axios from 'axios';

export const fetchStudents = async(filter, year, searchTerm) => {
    try {
        const response = await axios.get('http://localhost:1000/api/students', {
            params: {
                filter,
                year: year || '', // Ensure year is properly formatted
                searchTerm,
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching students:', error);
        throw error;
    }
};