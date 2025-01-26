// utils/notifications.js
const sendNotificationToNearbyWorkers = async (job) => {
    try {
        console.log('Finding workers for job:', job._id);
        
        // Find workers within radius who match the job category
        const nearbyWorkers = await Worker.find({
            categories: job.category,
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: job.location.coordinates
                    },
                    $maxDistance: 10000 // 10km radius
                }
            }
        });

        console.log('Found nearby workers:', nearbyWorkers.length);

        // Create notifications for each nearby worker
        const notificationPromises = nearbyWorkers.map(worker => {
            console.log('Sending notification to worker:', worker._id);
            return Worker.findByIdAndUpdate(
                worker._id,
                {
                    $push: {
                        notifications: {
                            type: 'new_job',
                            job: job._id,
                            message: `New ${job.category} job available in your area!`
                        }
                    }
                }
            );
        });

        await Promise.all(notificationPromises);
        console.log('All notifications sent successfully');
    } catch (error) {
        console.error('Error sending notifications:', error);
    }
};

module.exports = { sendNotificationToNearbyWorkers };