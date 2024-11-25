const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    Name: { type: String, required: true },
    Reg_No: { type: String, required: true },
    Year: { type: Number, required: true },
    School: { type: String, required: true },
    Company: { type: String, required: true },
    ApplicationStatus: {
        type: String,
        required: true,
        enum: ['Applied', 'Shortlisted', 'Placed', 'Not placed'],
    },
    Category: { type: String, required: true },
    CTC: { type: String },
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;