const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

router.get('/', async(req, res) => {
            try {
                const { filter, year, searchTerm } = req.query;


                const yearFilter = year ? parseInt(year) : null;


                let query = {};
                if (filter && filter !== 'All Students') {
                    query.status = filter;
                }
                if (yearFilter) {
                    query.year = yearFilter;
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