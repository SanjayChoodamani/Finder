import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Clock, DollarSign } from 'lucide-react';

const JobCard = ({ job, isAccepted = false, locationInfo: propLocationInfo = null }) => {
    const [locationInfo, setLocationInfo] = useState(propLocationInfo);
    
    useEffect(() => {
        // Log job data for debugging
        console.log('JobCard received job:', {
            id: job._id,
            title: job.title,
            hasApproxLocation: !!job.approximateLocation,
            approxLocation: job.approximateLocation,
            address: job.address,
            isAccepted
        });
        
        // If locationInfo is provided from parent, use that
        if (propLocationInfo) {
            setLocationInfo(propLocationInfo);
        } 
        // Otherwise check location status directly if the job is accepted
        else if (isAccepted && !locationInfo) {
            checkLocationStatus();
        }
    }, [isAccepted, job._id, propLocationInfo]);

    const checkLocationStatus = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/api/worker/job-location/${job._id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const data = await response.json();
            console.log('Location check result:', data);
            setLocationInfo(data);
        } catch (error) {
            console.error('Error checking location:', error);
            setLocationInfo({
                available: false,
                message: 'Error checking location availability'
            });
        }
    };


    // Format date for display
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Format time for location reveal
    const formatRevealTime = (dateString) => {
        if (!dateString) return '';
        
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
            
            <div className="mt-2">
                <p className="text-sm text-gray-600">{job.description}</p>
            </div>
            
            <div className="mt-3 flex items-center text-sm text-gray-500">
                <MapPin size={16} className="mr-1" />
                <span>
                    {isAccepted && locationInfo?.available && locationInfo?.address 
                        ? locationInfo.address 
                        : job.approximateLocation || "Location will be revealed once accepted"}
                </span>
            </div>
            
            <div className="mt-2 flex items-center text-sm text-gray-500">
                <Calendar size={16} className="mr-1" />
                <span>{formatDate(job.deadline)}</span>
            </div>
            
            <div className="mt-2 flex items-center text-sm text-gray-500">
                <Clock size={16} className="mr-1" />
                <span>{job.timeStart} - {job.timeEnd}</span>
            </div>
            
            <div className="mt-2 flex items-center text-sm font-medium text-gray-900">
                <DollarSign size={16} className="mr-1" />
                <span>₹{job.budget}</span>
            </div>
            
            {isAccepted && locationInfo && !locationInfo.available && (
                <div className="mt-3 bg-blue-50 p-3 rounded-md">
                    <p className="text-sm text-blue-800">
                        {locationInfo.message || "Exact location will be revealed 3 hours before job start time."}
                    </p>
                    {locationInfo.revealTime && (
                        <p className="text-xs text-blue-700 mt-1">
                            Available at: {formatRevealTime(locationInfo.revealTime)}
                        </p>
                    )}
                </div>
            )}
            
            <div className="mt-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {job.category}
                </span>
            </div>
        </div>
    );
};

export default JobCard;