const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('./models/User');
const Student = require('./models/Student');
const LoginSession = require('./models/LoginSession');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const csv = require('csv-parser');
const app = express();
const xlsx = require('xlsx');

const port = process.env.PORT || 3000;

app.use(cors({
  origin: ["https://job-portal-eight-eta.vercel.app/login"],
  methods: ["POST", "GET"],
  credentials: true
}));

app.use(express.json());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
app.get('/', (req, res) => {
  res.send('Welcome to the Job Portal!');
});

app.post('/api/register', [
    body('username').isString().notEmpty().withMessage('Username is required'),
    body('password').isString().notEmpty().withMessage('Password is required'),
], async(req, res) => {
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
});

app.post('/api/login', [
    body('username').isString().notEmpty().withMessage('Username is required'),
    body('password').isString().notEmpty().withMessage('Password is required'),
], async(req, res) => {
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
            expiresIn: '5m'
        });

        const currentTime = new Date();
        const istTime = currentTime.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

        const session = new LoginSession({
            userId: user._id,
            username,
            loginTime: istTime,
            token
        });
        await session.save();

        res.json({ token });
    } catch (error) {
        console.error('Error logging in user:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});

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


app.get('/api/students', async(req, res) => {
    const { searchTerm, filter, year, school, typeFilter } = req.query;
    const validStatuses = ['Placed', 'Not placed', 'Shortlisted', 'Applied'];

    const query = {};
    console.log("Received query parameters:", { searchTerm, filter, year, school, typeFilter });

    try {
        if (searchTerm) {
            const regex = new RegExp(`^${searchTerm.trim()}`, 'i');
            query.Reg_No = { $regex: regex };
        }

        if (filter && validStatuses.includes(filter.trim())) {
            query.ApplicationStatus = filter.trim();
        }

        if (year) {
            const parsedYear = parseInt(year, 10);
            if (!isNaN(parsedYear)) {
                query.Year = parsedYear;
            } else {
                return res.status(400).json({ message: "Invalid year format" });
            }
        }

        if (school) {
            console.log(`Using school filter: ${school}`);
            const schoolTrimmed = school.trim();
            const schoolRegex = new RegExp(schoolTrimmed, 'i');
            query.School = schoolRegex;
        }

        if (typeFilter) {
            query.Type = typeFilter.trim();
        }

        console.log("Constructed MongoDB Query:", query);

        const students = await Student.find(query);

        if (!students || students.length === 0) {
            return res.json([]);
        }

        res.json(students);

    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ message: 'Server error while fetching students' });
    }
});

app.get('/api/filters', async(req, res) => {
    try {
        const schools = await Student.distinct('School');
        const types = await Student.distinct('Type');
        const years = await Student.distinct('Year');

        res.json({
            schools: schools,
            types: types,
            years: years
        });
    } catch (error) {
        console.error('Error fetching filters:', error);
        res.status(500).json({ message: 'Error fetching filters' });
    }
});


app.get('/api/schools', async(req, res) => {
    try {
        const schools = await Student.distinct('School');
        res.json(schools);
    } catch (error) {
        console.error('Error fetching schools:', error);
        res.status(500).json({ message: 'Error fetching schools' });
    }
});


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

app.get('/api/stats', async(req, res) => {
    try {
        const stats = await Student.aggregate([{
                $addFields: {
                    CTC_numeric: {
                        $toDouble: {
                            $trim: {
                                input: { $substrCP: ["$CTC", 0, { $indexOfCP: ["$CTC", " "] }] },
                                chars: " "
                            }
                        }
                    }
                }
            },
            {
                $sort: {
                    CTC_numeric: -1
                }
            },
            {
                $group: {
                    _id: "$Year",
                    total: { $sum: 1 },
                    placed: { $sum: { $cond: [{ $eq: ["$ApplicationStatus", "Placed"] }, 1, 0] } },
                    notPlaced: { $sum: { $cond: [{ $eq: ["$ApplicationStatus", "Not placed"] }, 1, 0] } },
                    maxCTC: { $max: "$CTC_numeric" },
                    topStudent: {
                        $first: {
                            name: "$Name",
                            company: "$Company",
                            ctc: "$CTC",
                            regNo: "$Reg_No"
                        }
                    }
                }
            },
            {
                $project: {
                    year: "$_id",
                    total: 1,
                    placed: 1,
                    notPlaced: 1,
                    maxCTC: 1,
                    topStudent: 1,
                    _id: 0
                }
            }
        ]);

        res.json(stats);
    } catch (error) {
        console.error('Error fetching stats:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});





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
app.get('/api/company', async(req, res) => {
    try {
        const companies = await Student.distinct('Company');
        res.json(companies);
    } catch (error) {
        console.error('Error fetching companies:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/api/placement', async(req, res) => {
    const { years, company } = req.body;

    const query = {};
    if (years) {
        query.Year = { $in: years.map(Number) };
    }
    if (company) {
        query.Company = company;
    }

    try {
        const placements = await Student.find(query);
        res.json(placements);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching placement data' });
    }
});
app.get('/api/suggest-half-decades', async(req, res) => {
    try {
        const students = await Student.find();
        const uniqueYears = await Student.distinct('Year');

        const halfDecades = [];

        uniqueYears.forEach(year => {
            const decadeStart = Math.floor(year / 10) * 10;
            const halfDecade1 = decadeStart;
            const halfDecade2 = decadeStart + 5;
            if (!halfDecades.includes(halfDecade1)) {
                halfDecades.push(halfDecade1);
            }
            if (!halfDecades.includes(halfDecade2)) {
                halfDecades.push(halfDecade2);
            }
        });

        res.json({ students, halfDecades });
    } catch (error) {
        console.error('Error fetching students and half decades:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});
const requiredColumns = [
    'Name',
    'Reg_No',
    'Year',
    'School',
    'Company',
    'ApplicationStatus',
    'Category',
    'CTC',
];

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileExtension = path.extname(req.file.originalname).toLowerCase();

    if (fileExtension === '.csv' || fileExtension === '.json') {
        handleValidFile(filePath, res);
    } else if (fileExtension === '.xlsx' || fileExtension === '.xls') {
        convertXlsxToJson(filePath, res);
    } else {
        return res.status(400).json({ message: 'Invalid file format. Please upload CSV, JSON, or XLSX.' });
    }
});
const handleValidFile = (filePath, res) => {
    const results = [];
    let columnsChecked = false;
    let missingColumns = [];
    let extraColumns = [];

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('headers', (headers) => {
            missingColumns = requiredColumns.filter(col => !headers.includes(col));
            extraColumns = headers.filter(col => !requiredColumns.includes(col));

            if (missingColumns.length > 0 || extraColumns.length > 0) {
                return res.status(200).json({
                    message: 'Column attributes mismatch.',
                    details: {
                        missingColumns,
                        extraColumns,
                        expectedColumns: requiredColumns,
                    },
                });
            }
            columnsChecked = true;
        })
        .on('data', (data) => {
            if (columnsChecked) {
                results.push({
                    Name: data['Name'],
                    Reg_No: data['Reg_No'],
                    Year: parseInt(data['Year'], 10),
                    School: data['School'],
                    Company: data['Company'],
                    ApplicationStatus: data['ApplicationStatus'],
                    Category: data['Category'],
                    CTC: data['CTC'],
                });
            }
        })
        .on('end', async() => {
            try {
                if (columnsChecked && missingColumns.length === 0 && extraColumns.length === 0) {
                    await Student.insertMany(results);
                    res.status(200).json({ message: 'File uploaded and data inserted successfully' });
                }
            } catch (error) {
                console.error('Error inserting data into MongoDB:', error);
                res.status(500).json({ message: 'Error inserting data into MongoDB', error: error.message });
            } finally {
                fs.unlink(filePath, (unlinkError) => {
                    if (unlinkError) console.error('Error deleting file:', unlinkError);
                });
            }
        })
        .on('error', (error) => {
            console.error('Error processing file:', error);
            res.status(500).json({ message: 'File processing failed', error: error.message });
        });
};

const convertXlsxToJson = (filePath, res) => {
    try {
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = xlsx.utils.sheet_to_json(sheet);

        handleValidFileFromJsonData(jsonData, res, filePath);
    } catch (error) {
        console.error('Error processing XLSX file:', error);
        res.status(500).json({ message: 'Error processing XLSX file', error: error.message });
    }
};

const handleValidFileFromJsonData = async(jsonData, res, filePath) => {
    const results = [];
    let missingColumns = [];
    let extraColumns = [];

    jsonData.forEach((data) => {
        missingColumns = requiredColumns.filter(col => !(col in data));
        extraColumns = Object.keys(data).filter(col => !requiredColumns.includes(col));

        if (missingColumns.length > 0 || extraColumns.length > 0) {
            return res.status(200).json({
                message: 'Column attributes mismatch.',
                details: {
                    missingColumns,
                    extraColumns,
                    expectedColumns: requiredColumns,
                },
            });
        }

        results.push({
            Name: data['Name'],
            Reg_No: data['Reg_No'],
            Year: parseInt(data['Year'], 10),
            School: data['School'],
            Company: data['Company'],
            ApplicationStatus: data['ApplicationStatus'],
            Category: data['Category'],
            CTC: data['CTC'],
        });
    });

    try {
        await Student.insertMany(results);
        res.status(200).json({ message: 'File uploaded and data inserted successfully' });
    } catch (error) {
        console.error('Error inserting data into MongoDB:', error);
        res.status(500).json({ message: 'Error inserting data into MongoDB', error: error.message });
    } finally {
        fs.unlink(filePath, (unlinkError) => {
            if (unlinkError) console.error('Error deleting file:', unlinkError);
        });
    }
};


app.get('/api/suggest-years', async(req, res) => {
    try {
        const years = await Student.distinct('Year');
        console.log('Fetched Years:', years);
        res.json({ years });
    } catch (error) {
        console.error('Error fetching unique years:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/api/compare-years', async(req, res) => {
    const { firstYearRange, secondYearRange } = req.body;

    console.log('Comparing year ranges:', { firstYearRange, secondYearRange });

    try {
        const firstYearData = await Student.aggregate([
            { $match: { Year: { $in: firstYearRange } } },
            {
                $group: {
                    _id: '$ApplicationStatus',
                    count: { $sum: 1 }
                }
            }
        ]);

        const secondYearData = await Student.aggregate([
            { $match: { Year: { $in: secondYearRange } } },
            {
                $group: {
                    _id: '$ApplicationStatus',
                    count: { $sum: 1 }
                }
            }
        ]);

        console.log('First Year Data:', firstYearData);
        console.log('Second Year Data:', secondYearData);

        const statuses = [...new Set([...firstYearData.map(d => d._id), ...secondYearData.map(d => d._id)])];

        const firstYearCounts = statuses.map(status => {
            const found = firstYearData.find(d => d._id === status);
            return found ? found.count : 0;
        });

        const secondYearCounts = statuses.map(status => {
            const found = secondYearData.find(d => d._id === status);
            return found ? found.count : 0;
        });

        res.json({
            statuses,
            firstYearData: firstYearCounts,
            secondYearData: secondYearCounts
        });
    } catch (error) {
        console.error('Error comparing year ranges:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});
app.get('/api/students/ctc-by-school-year', async(req, res) => {
    try {
        const data = await Student.aggregate([{
                $addFields: {
                    ctcNumeric: {
                        $toDouble: {
                            $arrayElemAt: [{ $split: ["$CTC", " LPA"] }, 0]
                        }
                    }
                }
            },
            {
                $group: {
                    _id: { school: "$School", year: "$Year" },
                    maxCTC: { $max: "$ctcNumeric" },
                    avgCTC: { $avg: "$ctcNumeric" }
                }
            },
            {
                $project: {
                    _id: 0,
                    school: "$_id.school",
                    year: "$_id.year",
                    maxCTC: { $round: ["$maxCTC", 1] },
                    avgCTC: { $round: ["$avgCTC", 1] }
                }
            }
        ]);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
