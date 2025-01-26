import { Calendar, MapPin } from 'react-feather';

// components/dashboard/ActiveJobsList.js
const ActiveJobsList = ({ jobs, onStatusUpdate }) => {
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
            
            if (response.ok) {
                onStatusUpdate();
            }
        } catch (error) {
            console.error('Error updating job status:', error);
        }
    };

    return (
        <div className="space-y-4">
            {jobs.map((job) => (
                <div 
                    key={job._id}
                    className="border border-gray-200 rounded-lg p-4"
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                            <div className="mt-2 flex items-center space-x-4">
                                <span className="text-sm text-gray-500">
                                    <Calendar size={16} className="inline mr-1" />
                                    {new Date(job.deadline).toLocaleDateString()}
                                </span>
                                <span className="text-sm text-gray-500">
                                    <MapPin size={16} className="inline mr-1" />
                                    {job.location}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            {job.status === 'in progress' && (
                                <button
                                    onClick={() => handleUpdateStatus(job._id, 'completed')}
                                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                                >
                                    Mark Complete
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ActiveJobsList;