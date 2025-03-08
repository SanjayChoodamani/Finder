const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['new_job', 'job_update', 'payment', 'message']
    },
    message: {
        type: String,
        required: true
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    },
    isRead: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const workerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    skills: [{
        type: String,
        required: true
    }],
    serviceRadius: {
        type: Number,
        default: 100 // in kilometers
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        }
    },
    notifications: [notificationSchema],
    city: String,
    rating: {
        type: Number,
        default: 0
    },
    completedJobs: {
        type: Number,
        default: 0
    }
});

// Add geospatial index - this is critical for location queries
workerSchema.index({ location: '2dsphere' });

// Add this pre-save middleware to ensure coordinates are numbers
workerSchema.pre('save', function(next) {
    if (this.location && this.location.coordinates) {
        this.location.coordinates = this.location.coordinates.map(coord => 
            typeof coord === 'string' ? parseFloat(coord) : coord
        );
    }
    next();
});

module.exports = mongoose.model('Worker', workerSchema);