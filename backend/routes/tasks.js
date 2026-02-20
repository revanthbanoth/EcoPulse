const express = require('express');
const Task = require('../models/Task');
const Submission = require('../models/Submission');
const { auth, teacherAuth } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find().populate('createdBy', 'fullName');
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a task
router.post('/', auth, teacherAuth, async (req, res) => {
    try {
        const task = new Task({ ...req.body, createdBy: req.user.id });
        await task.save();
        res.status(201).json(task);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update a task
router.put('/:id', auth, teacherAuth, async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json(task);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete a task
router.delete('/:id', auth, teacherAuth, async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ error: 'Task not found' });

        // Optionally delete all submissions associated with this task
        await Submission.deleteMany({ taskId: req.params.id });

        res.json({ message: 'Task and associated submissions deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
