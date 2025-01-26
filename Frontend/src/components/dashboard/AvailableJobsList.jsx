import { Calendar, MapPin } from 'react-feather';

const AvailableJobsList = ({ jobs, onAccept, isLoading }) => {
    const handleAcceptJob = async (jobId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/jobs/${jobId}/accept`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                onAccept();
            }
        } catch (error) {
            console.error('Error accepting job:', error);
        }
    };

    if (isLoading) {
        return <div className="text-center py-8">Loading available jobs...</div>;
    }

    if (jobs.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">No jobs available in your area right now</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {jobs.map((job) => (
                <div 
                    key={job._id} 
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{job.description}</p>
                            <div className="mt-2 flex items-center space-x-4">
                                <span className="text-sm text-gray-500">
                                    <MapPin size={16} className="inline mr-1" />
                                    {job.approximateLocation}
                                </span>
                                <span className="text-sm text-gray-500">
                                    <Calendar size={16} className="inline mr-1" />
                                    {new Date(job.deadline).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="mt-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {job.category}
                                </span>
                                <span className="ml-2 text-sm font-medium text-gray-900">
                                    ₹{job.budget}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => handleAcceptJob(job._id)}
                            className="bg-[#133E87] text-white px-4 py-2 rounded-lg hover:bg-[#133E87]/90 transition-colors"
                        >
                            Accept Job
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AvailableJobsList;