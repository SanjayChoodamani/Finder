import React from 'react';
import { Eye, Clock } from 'lucide-react';
import { format } from 'date-fns';

const StatusBadge = ({ status }) => {
    const getStatusStyles = () => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'in progress':
                return 'bg-blue-100 text-blue-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyles()}`}>
            {status}
        </span>
    );
};

const BookingHistoryTable = ({ jobs, onRefresh }) => {
    const formatDate = (dateString) => {
        return format(new Date(dateString), 'MMM dd, yyyy');
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    // Helper function to format location
    const formatLocation = (location) => {
        if (!location || !location.coordinates) return 'N/A';
        // Use the address instead of coordinates
        return location.address || 'Location available';
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Job Details
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date Posted
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Budget
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Worker
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {jobs.length === 0 ? (
                        <tr>
                            <td colSpan="7" className="px-6 py-12 text-center">
                                <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                <p className="text-gray-500 text-sm">No jobs posted yet</p>
                                <p className="text-gray-400 text-sm mt-1">
                                    Your job history will appear here once you start posting jobs
                                </p>
                            </td>
                        </tr>
                    ) : (
                        jobs.map((job) => (
                            <tr key={job._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900">
                                        {job.title}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {formatLocation(job.location)}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        {job.category.charAt(0).toUpperCase() + job.category.slice(1).replace('_', ' ')}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        {formatDate(job.createdAt)}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        {formatCurrency(job.budget)}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <StatusBadge status={job.status} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {job.worker ? (
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {job.worker.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {job.worker.phone}
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="text-sm text-gray-500">Not assigned</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button 
                                        className="text-[#133E87] hover:text-[#133E87]/80 transition-colors"
                                        onClick={() => console.log('View job details:', job._id)}
                                    >
                                        <Eye size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default BookingHistoryTable;