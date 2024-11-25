const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
require('dotenv').config();
const User = require('./models/User');
const Student = require('./models/Student');
const LoginSession = require('./models/LoginSession'); // Import LoginSession model
const app = express();
const port = process.env.PORT || 1000;

// CORS configuration
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
}));
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Registration endpoint
app.post('/api/register', [
        body('username').isString().notEmpty().withMessage('Username is required'),
        body('password').isString().notEmpty().withMessage('Password is required'),
    ],
    async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password } = req.body;

        try {
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res.status(400).json({ message: 'Username already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({ username, password: hashedPassword });
            await newUser.save();

            res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
            console.error('Error registering user:', error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
);

app.post('/api/login', [
        body('username').isString().notEmpty().withMessage('Username is required'),
        body('password').isString().notEmpty().withMessage('Password is required'),
    ],
    async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password } = req.body;

        try {
            const user = await User.findOne({ username });
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
                expiresIn: '5m' // Token expiration time
            });

            // Get current time in Indian Standard Time (IST)
            const currentTime = new Date();
            const istTime = currentTime.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

            // Save login session data
            const session = new LoginSession({
                userId: user._id,
                username: username,
                loginTime: istTime,
                token: token // Store token if needed for reference
            });
            await session.save();

            // Respond with token
            res.json({ token });

        } catch (error) {
            console.error('Error logging in user:', error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
);


// Get login sessions for a specific user
app.get('/api/sessions/:userId', async(req, res) => {
    const { userId } = req.params;

    try {
        const sessions = await LoginSession.find({ userId });
        res.json(sessions);
    } catch (error) {
        console.error('Error fetching sessions:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Refresh token endpoint
app.post('/api/refresh-token', async(req, res) => {
    const { token } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const newToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_SECRET, { expiresIn: '5m' });
        res.json({ token: newToken });
    } catch (error) {
        console.error('Error refreshing token:', error.message);
        res.status(401).json({ message: 'Invalid token' });
    }
});

// Get students with optional filtering
app.get('/api/students', async(req, res) => {
    try {
        const { filter, year, searchTerm } = req.query;
        let query = {};

        if (filter && filter !== 'All Students') {
            query.ApplicationStatus = filter;
        }

        if (year) {
            query.Year = parseInt(year, 10);
        }

        if (searchTerm) {
            query.Reg_No = { $regex: searchTerm, $options: 'i' };
        }

        const students = await Student.find(query);
        res.json(students);
    } catch (error) {
        console.error('Error fetching students:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get companies
app.get('/api/companies', async(req, res) => {
    const { year } = req.query;

    if (!year) {
        return res.status(400).json({ message: 'Year is required' });
    }

    try {
        const companies = await Student.aggregate([
            { $match: { Year: parseInt(year, 10) } },
            {
                $group: {
                    _id: "$Company",
                    placedCount: {
                        $sum: {
                            $cond: [{ $eq: ["$ApplicationStatus", "Placed"] }, 1, 0]
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    name: "$_id",
                    placedCount: 1
                }
            }
        ]);

        res.json(companies);
    } catch (error) {
        console.error('Error fetching companies:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get student statistics
app.get('/api/stats', async(req, res) => {
    try {
        const stats = await Student.aggregate([{
                $group: {
                    _id: "$Year",
                    total: { $sum: 1 },
                    placed: { $sum: { $cond: [{ $eq: ["$ApplicationStatus", "Placed"] }, 1, 0] } },
                    notPlaced: { $sum: { $cond: [{ $eq: ["$ApplicationStatus", "Not Placed"] }, 1, 0] } }
                }
            },
            { $project: { year: "$_id", total: 1, placed: 1, notPlaced: 1, _id: 0 } }
        ]);

        res.json(stats);
    } catch (error) {
        console.error('Error fetching stats:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Email sending
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

app.post('/send-email', (req, res) => {
    const { name, email, message } = req.body;

    const mailOptions = {
        from: email,
        to: 'kowshikaroopa@gmail.com',
        subject: `Message from ${name}`,
        text: message
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ message: 'Failed to send message', error: error.message });
        }
        console.log('Email sent:', info.response);
        res.status(200).json({ message: 'Message sent successfully' });
    });
});

//Fetch chart data for a specific year
app.get('/api/placements/chart-data', async(req, res) => {
    const year = parseInt(req.query.year, 10);

    if (!year) {
        return res.status(400).json({ message: 'Year is required' });
    }

    try {
        const placements = await Student.find({ Year: year });

        const chartData = placements.reduce((acc, student) => {
            const company = student.Company;
            if (!acc[company]) {
                acc[company] = 0;
            }
            if (student.ApplicationStatus === 'Placed') {
                acc[company] += 1;
            }
            return acc;
        }, {});

        const labels = Object.keys(chartData);
        const values = Object.values(chartData);

        res.json({ labels, values });
    } catch (error) {
        console.error('Error fetching chart data:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});