// routes/jobs.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const Job = require('../models/Job');
const { sendNotificationToNearbyWorkers } = require('../utils/notifications');

// create a job 
router.post('/create', auth, upload.array('images', 5), async (req, res) => {
    try {
        // Verify user is a client
        if (req.user.userType !== 'client') {
            return res.status(403).json({ message: 'Only clients can post jobs' });
        }

        const jobData = {
            ...req.body,
            user: req.user._id,
            images: req.files ? req.files.map(file => `/uploads/${file.filename}`) : []
        };

        const job = new Job(jobData);
        await job.save();

        // Send notifications to nearby workers after job is created
        await sendNotificationToNearbyWorkers(job);

        res.status(201).json(job);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get user's jobs
router.get('/my-posts', auth, async (req, res) => {
    try {
        const jobs = await Job.find({ user: req.user._id })
            .populate('worker', 'name phone email')
            .sort({ createdAt: -1 });
        
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Get worker's assigned jobs
router.get('/my-assignments', auth, async (req, res) => {
    try {
        if (req.user.userType !== 'worker') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const jobs = await Job.find({ worker: req.user._id })
            .populate('user', 'name phone email')
            .sort({ createdAt: -1 });
        
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get available jobs (for workers)
router.get('/available', auth, async (req, res) => {
    try {
        if (req.user.userType !== 'worker') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const jobs = await Job.find({
            status: 'pending',
            worker: null
        })
        .populate('user', 'name')
        .sort({ createdAt: -1 });

        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get job details
router.get('/:id', auth, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('user', 'name email phone')
            .populate('worker', 'name email phone rating');

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        res.json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update job status
router.patch('/:id/status', auth, async (req, res) => {
    try {
        const { status } = req.body;
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Verify authorization
        if (job.user.toString() !== req.user._id.toString() && 
            (!job.worker || job.worker.toString() !== req.user._id.toString())) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        job.status = status;
        if (status === 'completed') {
            job.completedAt = new Date();
            
            // Update worker stats
            if (job.worker) {
                await User.findByIdAndUpdate(job.worker, {
                    $inc: { completedJobs: 1 }
                });
            }
        }

        await job.save();
        res.json(job);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Accept job (for workers)
router.post('/:id/accept', auth, async (req, res) => {
    try {
        if (req.user.userType !== 'worker') {
            return res.status(403).json({ message: 'Only workers can accept jobs' });
        }

        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        if (job.worker || job.status !== 'pending') {
            return res.status(400).json({ message: 'Job is no longer available' });
        }

        job.worker = req.user._id;
        job.status = 'in progress';
        await job.save();

        res.json(job);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Add review and rating
router.post('/:id/review', auth, async (req, res) => {
    try {
        const { rating, review } = req.body;
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Only job poster can add review
        if (job.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        if (job.status !== 'completed') {
            return res.status(400).json({ message: 'Can only review completed jobs' });
        }

        job.rating = rating;
        job.review = review;
        await job.save();

        // Update worker's average rating
        const workerJobs = await Job.find({ 
            worker: job.worker,
            rating: { $exists: true }
        });

        const averageRating = workerJobs.reduce((acc, job) => acc + job.rating, 0) / workerJobs.length;

        await User.findByIdAndUpdate(job.worker, {
            rating: averageRating
        });

        res.json(job);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
