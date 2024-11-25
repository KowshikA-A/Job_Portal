// backend/api/students.js
const express = require('express');
const router = express.Router();
const Student = require('../models/Student'); // Adjust the path as necessary

router.get('/', async(req, res) => {
    try {
        const { filter, Year, searchTerm } = req.query;

        // Convert year to integer if it's a valid number
        const yearFilter = Year ? parseInt(year) : null;

        // Build query based on filters
        let query = {};
        if (filter && filter !== 'All Students') {
            query.status = filter;
        }
        if (yearFilter) {
            query.Year = yearFilter;
        }
        if (searchTerm) {
            query.regNo = searchTerm;
        }

        const students = await Student.find(query);
        res.json(students);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;