const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');
const User = require('../models/User');
const Task = require('../models/Task');
const { auth, teacherAuth } = require('../middleware/auth');
const { upload, cloudinary } = require('../middleware/upload');
const fs = require('fs');

// Student: Submit a task
router.post('/', auth, upload.single('image'), async (req, res) => {
    try {
        const { taskId, content } = req.body;
        let proofUrl = req.body.proofUrl;

        if (req.file) {
            try {
                // Upload directly to Cloudinary using SDK
                const result = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'ecopulse_submissions'
                });

                // Get the secure URL from Cloudinary
                proofUrl = result.secure_url;
            } catch (uploadErr) {
                console.error('Cloudinary Upload Error:', uploadErr);
                // Clean up local file even on failure
                if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
                return res.status(500).json({ error: 'Failed to upload image to Cloudinary' });
            } finally {
                // Clean up local file after success or error (if not already handled)
                if (req.file && fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }
            }
        }

        // Check if already submitted
        const existing = await Submission.findOne({
            taskId,
            studentId: req.user.id,
            status: 'pending'
        });

        if (existing) return res.status(400).json({ error: 'You already have a pending submission for this task.' });

        const submission = new Submission({
            taskId,
            studentId: req.user.id,
            proofUrl,
            content
        });
        await submission.save();
        res.status(201).json(submission);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Teacher: Get all submissions (optionally filtered by status)
router.get('/', auth, teacherAuth, async (req, res) => {
    try {
        const { status } = req.query;
        const query = status ? { status } : {};
        const submissions = await Submission.find(query)
            .populate('taskId')
            .populate('studentId', 'fullName email')
            .sort({ createdAt: -1 });
        res.json(submissions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Student: Get my submissions
router.get('/my', auth, async (req, res) => {
    try {
        const submissions = await Submission.find({ studentId: req.user.id })
            .populate('taskId')
            .sort({ createdAt: -1 });
        res.json(submissions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Teacher: Approve/Reject submission
router.patch('/:id', auth, teacherAuth, async (req, res) => {
    try {
        const { status, feedback } = req.body;
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const submission = await Submission.findById(req.params.id).populate('taskId');
        if (!submission) return res.status(404).json({ error: 'Submission not found' });
        if (submission.status !== 'pending') return res.status(400).json({ error: 'Decision already made' });

        submission.status = status;
        submission.feedback = feedback;

        if (status === 'approved') {
            const points = submission.taskId.pointsBase;
            submission.pointsAwarded = points;

            // Award points to user
            const user = await User.findById(submission.studentId);
            user.points += points;

            // Basic leveling logic: every 500 points = new level
            user.level = Math.floor(user.points / 500) + 1;
            await user.save();
        }

        await submission.save();
        res.json(submission);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
