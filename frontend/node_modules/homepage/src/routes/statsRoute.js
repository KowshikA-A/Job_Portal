const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// Route to get statistics
router.get('/stats', async(req, res) => {
    try {
        // Aggregate the stats based on year and applicationStatus
        const stats = await Student.aggregate([{
                $group: {
                    _id: {
                        year: "$year",
                        applicationStatus: "$applicationStatus"
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: "$_id.year",
                    total: { $sum: "$count" },
                    placed: { $sum: { $cond: [{ $eq: ["$_id.applicationStatus", "Placed"] }, "$count", 0] } },
                    notPlaced: { $sum: { $cond: [{ $eq: ["$_id.applicationStatus", "Not Placed"] }, "$count", 0] } },
                    // You can also add more conditions for 'Applied', 'Shortlisted' if needed.
                }
            },
            {
                $sort: { _id: 1 } // Sort by year in ascending order
            }
        ]);

        res.json(stats);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;