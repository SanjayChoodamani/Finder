// models/Worker.js
const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Point'],
        required: true
    },
    coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
    }
});

const workerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    categories: [{
        type: String,
        required: true
    }],
    location: {
        type: locationSchema,
        index: '2dsphere', // Enable geospatial queries
        required: true
    },
    serviceRadius: {
        type: Number, // in kilometers
        required: true,
        default: 10
    },
    availability: {
        type: String,
        enum: ['available', 'busy', 'offline'],
        default: 'available'
    },
    activeJobs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    }],
    rating: {
        type: Number,
        default: 0
    },
    totalJobs: {
        type: Number,
        default: 0
    },
    completedJobs: {
        type: Number,
        default: 0
    },
    notifications: [{
        type: {
            type: String,
            enum: ['new_job', 'job_update', 'location_reveal'],
            required: true
        },
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job'
        },
        message: String,
        isRead: {
            type: Boolean,
            default: false
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, { timestamps: true });

// Add indexes
workerSchema.index({ "location": "2dsphere" });
workerSchema.index({ "categories": 1 });

const Worker = mongoose.model('Worker', workerSchema);
module.exports = Worker;