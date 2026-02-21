const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Submission = require('../models/Submission');
const { auth, teacherAuth } = require('../middleware/auth');

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

// Get User Stats (student)
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

        res.json({ totalCompleted, pendingTasks, recentActivity });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Teacher Stats
router.get('/teacher-stats', auth, async (req, res) => {
    try {
        const Task = require('../models/Task');
        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalTasks = await Task.countDocuments();
        const pendingReviews = await Submission.countDocuments({ status: 'pending' });
        const approvedTotal = await Submission.countDocuments({ status: 'approved' });

        // Recent submissions to review
        const recentSubmissions = await Submission.find({ status: 'pending' })
            .populate('taskId', 'title')
            .populate('studentId', 'fullName')
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({ totalStudents, totalTasks, pendingReviews, approvedTotal, recentSubmissions });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Teacher: Get all students
router.get('/students', auth, teacherAuth, async (req, res) => {
    try {
        const students = await User.find({ role: 'student' })
            .select('fullName email points level streak classId createdAt')
            .sort({ points: -1 });

        // Attach submission counts to each student
        const studentData = await Promise.all(students.map(async (s) => {
            const completed = await Submission.countDocuments({ studentId: s._id, status: 'approved' });
            const pending = await Submission.countDocuments({ studentId: s._id, status: 'pending' });
            return {
                _id: s._id,
                fullName: s.fullName,
                email: s.email,
                points: s.points,
                level: s.level,
                streak: s.streak,
                classId: s.classId,
                completedCount: completed,
                pendingCount: pending,
            };
        }));

        res.json(studentData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
