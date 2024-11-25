const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Student = mongoose.model('Student');
router.get('/companies', async(req, res) => {
    const year = parseInt(req.query.year, 10);
    try {
        const companies = await Student.aggregate([
            { $match: { Year: year } },
            {
                $group: {
                    _id: '$Company',
                    placedCount: {
                        $sum: {
                            $cond: [{ $eq: ['$ApplicationStatus', 'Placed'] }, 1, 0]
                        }
                    }
                }
            },
            {
                $project: {
                    id: { $toString: '$_id' },
                    name: '$_id',
                    placedCount: 1
                }
            }
        ]);
        res.json(companies);
    } catch (error) {
        console.error('Error fetching companies:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
module.exports = router;