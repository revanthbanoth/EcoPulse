const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    proofUrl: { type: String },
    content: { type: String },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    feedback: { type: String },
    pointsAwarded: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Submission', submissionSchema);
