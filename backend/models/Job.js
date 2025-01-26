// models/Job.js
const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: [
            'plumbing',
            'electrical',
            'carpentry',
            'painting',
            'cleaning',
            'gardening',
            'moving',
            'appliance_repair',
            'hvac',
            'roofing',
            'other'
        ]
    },
    location: {
        type: String,
        required: true
    },
    budget: {
        type: Number,
        required: true,
        min: 0
    },
    deadline: {
        type: Date,
        required: true
    },
    timePreference: {
        type: String,
        enum: ['morning', 'afternoon', 'evening'],
        required: true
    },
    images: [{
        type: String
    }],
    status: {
        type: String,
        enum: ['pending', 'in progress', 'completed', 'cancelled'],
        default: 'pending'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    worker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    completedAt: {
        type: Date
    }
});

const Job = mongoose.model('Job', jobSchema);
module.exports = Job;