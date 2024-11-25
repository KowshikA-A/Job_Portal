// models/Student.js
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    Reg_No: { type: String, required: true },
    Name: { type: String, required: true },
    Year: { type: Number, required: true },
    Company: { type: String, required: true },
    ApplicationStatus: { type: String, required: true }
});

module.exports = mongoose.model('Student', studentSchema);