const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Submission = require('../models/Submission');
const { auth } = require('../middleware/auth');

// Get Leaderboard
router.get('/leaderboard', async (req, res) => {
    try {
        const topUsers = await User.find({ role: 'student' })
            .select('fullName points level avatarUrl')
            .sort({ points: -1 })
            .limit(10);
        res.json(topUsers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get User Stats (e.g., for dashboard)
router.get('/stats', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const totalCompleted = await Submission.countDocuments({ studentId: userId, status: 'approved' });
        const pendingTasks = await Submission.countDocuments({ studentId: userId, status: 'pending' });

        // Recently approved tasks
        const recentActivity = await Submission.find({ studentId: userId, status: 'approved' })
            .populate('taskId', 'title')
            .sort({ updatedAt: -1 })
            .limit(5);

        res.json({
            totalCompleted,
            pendingTasks,
            recentActivity
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
