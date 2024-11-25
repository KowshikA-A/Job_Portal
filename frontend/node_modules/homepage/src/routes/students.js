const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// GET all students
router.get('/', async(req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Additional routes can be added here

module.exports = router;