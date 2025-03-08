const Worker = require('../models/Worker');
const webpush = require('web-push');

// Configure web-push with your VAPID keys
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
    webpush.setVapidDetails(
        'mailto:example@yourdomain.com',
        process.env.VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY
    );
}

const sendNotificationToNearbyWorkers = async (job) => {
    try {
        console.log(`Finding workers for new job: ${job.title} (${job._id})`);
        
        // Ensure job has location and category
        if (!job.location || !job.category) {
            console.error('Job is missing location or category, cannot send notifications');
            return;
        }

        console.log(`Job location: ${JSON.stringify(job.location)}, category: ${job.category}`);
        
        // Find workers within radius who have the required category/skill
        // Don't use $near if coordinates are invalid
        let query = {
            $or: [
                { skills: { $in: [job.category.toLowerCase()] } },
                { categories: { $in: [job.category.toLowerCase()] } }
            ]
        };
        
        // Only add location query if coordinates are valid
        if (job.location && 
            job.location.coordinates && 
            job.location.coordinates.length === 2 &&
            job.location.coordinates[0] !== 0) {
            
            query.location = {
                $near: {
                    $geometry: job.location,
                    $maxDistance: (job.radius || 10) * 1000 // Convert km to meters
                }
            };
            console.log('Using geo query with valid coordinates');
        } else {
            console.log('Invalid job coordinates, skipping geo query');
        }
        
        console.log('Worker query:', JSON.stringify(query));
        const nearbyWorkers = await Worker.find(query);
        
        console.log(`Found ${nearbyWorkers.length} nearby workers for job ${job._id}`);

        if (nearbyWorkers.length === 0) {
            return;
        }
        
        // Create a notification for each worker
        const notifications = nearbyWorkers.map(async (worker) => {
            try {
                // Create notification object with timestamp
                const notification = {
                    type: 'new_job',
                    job: job._id,
                    message: `New job available: ${job.title}`,
                    isRead: false,
                    createdAt: new Date()
                };
                
                // Add notification to worker's notifications array
                worker.notifications = worker.notifications || [];
                worker.notifications.push(notification);
                
                // Save the updated worker document
                await worker.save();
                console.log(`Notification sent to worker ${worker._id} for job ${job._id}`);
                
                // Send push notification if subscription exists
                if (worker.pushSubscription && process.env.VAPID_PUBLIC_KEY) {
                    try {
                        const payload = JSON.stringify({
                            title: 'New Job Available!',
                            body: `${job.title} in ${job.address}`,
                            icon: '/logo.png',
                            data: { jobId: job._id.toString() }
                        });
                        
                        await webpush.sendNotification(worker.pushSubscription, payload);
                        console.log(`Push notification sent to worker ${worker._id}`);
                    } catch (err) {
                        console.error('Push notification error:', err);
                    }
                }
            } catch (err) {
                console.error(`Error notifying worker ${worker._id}:`, err);
            }
        });
        
        await Promise.all(notifications);
    } catch (error) {
        console.error('Error sending notifications:', error);
    }
};

module.exports = {
    sendNotificationToNearbyWorkers
};