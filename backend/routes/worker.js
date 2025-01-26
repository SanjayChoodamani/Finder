// routes/worker.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Worker = require('../models/Worker');
const Job = require('../models/Job');

// Update worker location
router.post('/location', auth, async (req, res) => {
    try {
        const { longitude, latitude } = req.body;
        
        const worker = await Worker.findOneAndUpdate(
            { user: req.user._id },
            {
                location: {
                    type: 'Point',
                    coordinates: [longitude, latitude]
                }
            },
            { new: true }
        );

        res.json(worker);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get nearby jobs matching worker's categories
router.get('/available-jobs', auth, async (req, res) => {
    try {
        const worker = await Worker.findOne({ user: req.user._id });
        if (!worker) {
            return res.status(404).json({ message: 'Worker profile not found' });
        }

        const jobs = await Job.find({
            status: 'pending',
            worker: null,
            category: { $in: worker.categories },
            location: {
                $near: {
                    $geometry: worker.location,
                    $maxDistance: worker.serviceRadius * 1000 // Convert km to meters
                }
            }
        })
        .populate('user', 'name')
        .select('-exactLocation') // Don't send exact location until job is accepted
        .sort('-createdAt');

        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get worker's notifications
router.get('/notifications', auth, async (req, res) => {
    try {
        const worker = await Worker.findOne({ user: req.user._id })
            .populate({
                path: 'notifications.job',
                select: 'title category status'
            });

        res.json(worker.notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Mark notification as read
router.patch('/notifications/:notificationId', auth, async (req, res) => {
    try {
        const worker = await Worker.findOneAndUpdate(
            { 
                user: req.user._id,
                'notifications._id': req.params.notificationId 
            },
            { 
                $set: { 'notifications.$.isRead': true } 
            },
            { new: true }
        );

        res.json(worker.notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get job exact location (only available on job date)
router.get('/job-location/:jobId', auth, async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId);
        
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check if worker is assigned to this job
        if (job.worker.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Check if it's time to reveal location
        const jobDate = new Date(job.deadline);
        const now = new Date();
        if (now < jobDate) {
            return res.status(403).json({ message: 'Location will be revealed on the job date' });
        }

        res.json({
            location: job.location,
            address: job.address
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

