// ActiveJobsList.jsx
import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Clock } from 'lucide-react';
import JobCard from './JobCard';

const ActiveJobsList = ({ jobs, onStatusUpdate, checkLocationAvailability }) => {
    const [jobLocations, setJobLocations] = useState({});
    
    useEffect(() => {
        // Check location availability for all active jobs
        const checkAllJobLocations = async () => {
            const locations = {};
            for (const job of jobs) {
                if (job.status === 'in progress') {
                    locations[job._id] = await checkLocationAvailability(job._id);
                }
            }
            setJobLocations(locations);
        };
        
        if (jobs.length > 0 && checkLocationAvailability) {
            checkAllJobLocations();
        }
    }, [jobs, checkLocationAvailability]);

    const handleUpdateStatus = async (jobId, status) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/jobs/${jobId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });
            
            if (!response.ok) {
                throw new Error('Failed to update job status');
            }
            
            onStatusUpdate();
        } catch (error) {
            console.error('Error updating job status:', error);
            alert('Error updating job status: ' + error.message);
        }
    };
    
    if (jobs.length === 0) {
        return (
            <div className="text-center py-8">
                <div className="mx-auto h-12 w-12 text-gray-400">
                    <Clock size={48} />
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No active jobs</h3>
                <p className="mt-1 text-sm text-gray-500">You don't have any active jobs at the moment.</p>
            </div>
        );
    }
    
    return (
        <div className="space-y-6">
            {jobs.map((job) => (
                <div key={job._id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="p-4">
                        <JobCard 
                            job={job} 
                            isAccepted={true} 
                            locationInfo={jobLocations[job._id]}
                        />
                        
                        {jobLocations[job._id]?.available && (
                            <div className="mt-2 p-3 bg-green-50 rounded-md">
                                <p className="text-sm text-green-800 flex items-center">
                                    <MapPin size={16} className="mr-1" />
                                    Exact location: {jobLocations[job._id].address}
                                </p>
                            </div>
                        )}
                        
                        {job.status === 'in progress' && jobLocations[job._id]?.available && (
                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={() => handleUpdateStatus(job._id, 'completed')}
                                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                                >
                                    Mark Complete
                                </button>
                            </div>
                        )}
                        
                        {job.status === 'in progress' && !jobLocations[job._id]?.available && (
                            <div className="mt-2 p-3 bg-blue-50 rounded-md">
                                <p className="text-sm text-blue-800">
                                    {jobLocations[job._id]?.message || "Location will be revealed closer to job time"}
                                </p>
                                {jobLocations[job._id]?.revealTime && (
                                    <p className="text-xs text-blue-700 mt-1">
                                        Available at: {jobLocations[job._id].revealTime.toLocaleString()}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ActiveJobsList;