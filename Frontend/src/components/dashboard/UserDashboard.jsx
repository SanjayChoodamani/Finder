import React, { useState, useEffect, useRef } from 'react';
import {
    Plus, Settings, LogOut, User, Calendar, MapPin, Star, MessageSquare,
    FileText, Image as ImageIcon, Clock, DollarSign, X, Phone, Mail, CheckCircle
} from 'lucide-react';
import { format } from 'date-fns';
import JobPostingModal from './JobPostingModal';
import BookingHistoryTable from './BookingHistoryTable';

// Job Details Modal Component
const JobDetailsModal = ({ isOpen, onClose, job, onSubmitReview, onCancelJob }) => {
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen || !job) return null;

    const handleSubmitReview = async () => {
        if (rating === 0) {
            setError('Please select a rating');
            return;
        }
        
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/jobs/${job._id}/review`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ rating, review })
            });

            if (!response.ok) {
                throw new Error('Failed to submit review');
            }

            onSubmitReview();
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to submit review');
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), 'MMM dd, yyyy');
        } catch (e) {
            return dateString;
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    // Get status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'in progress': return 'bg-blue-100 text-blue-800';
            case 'completed': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
                </div>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="flex justify-between items-start">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Job Details</h3>
                            <button 
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className="mt-4 border-t pt-4">
                            <div className="flex justify-between mb-4">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">{job.title}</h2>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                                        {job.status}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Posted on</p>
                                    <p className="text-sm font-medium">{formatDate(job.createdAt)}</p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div>
                                    <p className="text-sm text-gray-500">Category</p>
                                    <p className="font-medium">{job.category}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Budget</p>
                                    <p className="font-medium">{formatCurrency(job.budget)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Deadline</p>
                                    <p className="font-medium">{formatDate(job.deadline)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Time</p>
                                    <p className="font-medium">{job.timeStart} - {job.timeEnd}</p>
                                </div>
                            </div>
                            
                            <div className="mb-6">
                                <p className="text-sm text-gray-500 mb-1">Description</p>
                                <p className="text-gray-700">{job.description}</p>
                            </div>
                            
                            <div className="mb-6">
                                <p className="text-sm text-gray-500 mb-1">Location</p>
                                <p className="text-gray-700 flex items-center">
                                    <MapPin size={16} className="mr-1" />
                                    {job.address}
                                </p>
                            </div>
                            
                            {job.images && job.images.length > 0 && (
                                <div className="mb-6">
                                    <p className="text-sm text-gray-500 mb-2">Images</p>
                                    <div className="grid grid-cols-3 gap-2">
                                        {job.images.map((image, index) => (
                                            <img 
                                                key={index} 
                                                src={`http://localhost:5000${image}`} 
                                                alt={`Job image ${index+1}`}
                                                className="rounded-lg h-24 w-full object-cover"
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {job.worker && (
                                <div className="mb-6 border p-4 rounded-lg bg-gray-50">
                                    <p className="text-sm text-gray-500 mb-2">Assigned Worker</p>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-gray-900">{job.worker.name}</p>
                                            <div className="flex space-x-4 mt-1">
                                                <p className="text-sm text-gray-600 flex items-center">
                                                    <Phone size={14} className="mr-1" />
                                                    {job.worker.phone}
                                                </p>
                                                <p className="text-sm text-gray-600 flex items-center">
                                                    <Mail size={14} className="mr-1" />
                                                    {job.worker.email}
                                                </p>
                                            </div>
                                        </div>
                                        {job.worker.rating && (
                                            <div className="flex items-center">
                                                <Star size={16} className="text-yellow-400" />
                                                <span className="ml-1 text-gray-900">{job.worker.rating.toFixed(1)}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                            
                            {/* Review Section - Only show for completed jobs without reviews */}
                            {job.status === 'completed' && !job.review && (
                                <div className="border-t pt-4 mt-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Leave a Review</h3>
                                    
                                    {error && (
                                        <div className="bg-red-50 border border-red-100 text-red-700 p-3 rounded-md mb-4">
                                            {error}
                                        </div>
                                    )}
                                    
                                    <div className="mb-4">
                                        <p className="text-sm text-gray-500 mb-2">Rating</p>
                                        <div className="flex space-x-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setRating(star)}
                                                    className={`p-1 rounded-full focus:outline-none ${
                                                        rating >= star ? 'text-yellow-400' : 'text-gray-300'
                                                    }`}
                                                >
                                                    <Star size={28} fill={rating >= star ? "currentColor" : "none"} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div className="mb-4">
                                        <label htmlFor="review" className="block text-sm text-gray-500 mb-2">
                                            Review (Optional)
                                        </label>
                                        <textarea
                                            id="review"
                                            rows="3"
                                            className="w-full border border-gray-300 rounded-md p-2 focus:ring-[#133E87] focus:border-[#133E87] outline-none"
                                            placeholder="Share your experience with this worker..."
                                            value={review}
                                            onChange={(e) => setReview(e.target.value)}
                                        ></textarea>
                                    </div>
                                    
                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            onClick={handleSubmitReview}
                                            disabled={isSubmitting}
                                            className="bg-[#133E87] text-white py-2 px-4 rounded-md hover:bg-[#133E87]/90 disabled:opacity-50"
                                        >
                                            {isSubmitting ? 'Submitting...' : 'Submit Review'}
                                        </button>
                                    </div>
                                </div>
                            )}
                            
                            {/* Show existing review if there is one */}
                            {job.review && job.rating && (
                                <div className="border-t pt-4 mt-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Your Review</h3>
                                    <div className="flex mb-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star 
                                                key={star} 
                                                size={20} 
                                                fill={job.rating >= star ? "#FBBF24" : "none"}
                                                stroke={job.rating >= star ? "#FBBF24" : "currentColor"}
                                                className="text-yellow-400" 
                                            />
                                        ))}
                                    </div>
                                    {job.review && <p className="text-gray-700">{job.review}</p>}
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                            Close
                        </button>
                        
                        {job.status === 'pending' && (
                            <button
                                type="button"
                                onClick={() => onCancelJob(job._id)}
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-red-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-red-700 hover:bg-red-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                            >
                                Cancel Job
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Settings Modal Component
const SettingsModal = ({ isOpen, onClose, user, onUpdateSettings }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        }
    }, [user]);
    
    if (!isOpen) return null;
    
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccessMessage('');
        
        try {
            // Validation for password change
            if (formData.newPassword) {
                if (formData.newPassword.length < 6) {
                    throw new Error('Password must be at least 6 characters');
                }
                if (formData.newPassword !== formData.confirmPassword) {
                    throw new Error('New passwords do not match');
                }
                if (!formData.currentPassword) {
                    throw new Error('Current password is required to set new password');
                }
            }
            
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/auth/update-profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    currentPassword: formData.currentPassword || undefined,
                    newPassword: formData.newPassword || undefined
                })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to update profile');
            }
            
            setSuccessMessage('Profile updated successfully');
            onUpdateSettings(data.user);
            
            // Clear password fields
            setFormData({
                ...formData,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
                </div>
                
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Account Settings</h3>
                            <button 
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        
                        {error && (
                            <div className="bg-red-50 border border-red-100 text-red-700 p-3 rounded-md mb-4">
                                {error}
                            </div>
                        )}
                        
                        {successMessage && (
                            <div className="bg-green-50 border border-green-100 text-green-700 p-3 rounded-md mb-4 flex items-center">
                                <CheckCircle className="mr-2" size={16} />
                                {successMessage}
                            </div>
                        )}
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#133E87] focus:border-[#133E87]"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#133E87] focus:border-[#133E87]"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                    Phone
                                </label>
                                <input
                                    type="text"
                                    name="phone"
                                    id="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#133E87] focus:border-[#133E87]"
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                    Address
                                </label>
                                <textarea
                                    name="address"
                                    id="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    rows="2"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#133E87] focus:border-[#133E87]"
                                ></textarea>
                            </div>
                            
                            <div className="border-t pt-4">
                                <h4 className="text-md font-medium text-gray-900 mb-3">Change Password</h4>
                                
                                <div>
                                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        name="currentPassword"
                                        id="currentPassword"
                                        value={formData.currentPassword}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#133E87] focus:border-[#133E87]"
                                    />
                                </div>
                                
                                <div className="mt-4">
                                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        id="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#133E87] focus:border-[#133E87]"
                                    />
                                </div>
                                
                                <div className="mt-4">
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        id="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#133E87] focus:border-[#133E87]"
                                    />
                                </div>
                            </div>
                            
                            <div className="mt-5 sm:mt-6 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#133E87] text-base font-medium text-white hover:bg-[#133E87]/90 focus:outline-none sm:text-sm disabled:opacity-50"
                                >
                                    {isLoading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

const UserDashboard = () => {
    const [showPostingModal, setShowPostingModal] = useState(false);
    const [showJobDetailsModal, setShowJobDetailsModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [user, setUser] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        fetchUserData();
        fetchJobs();

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/auth/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
            } else {
                throw new Error('Failed to fetch user data');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            setError('Failed to load user data');
        }
    };

    const fetchJobs = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/jobs/my-posts', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setJobs(data);
            } else {
                throw new Error('Failed to fetch jobs');
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
            setError('Failed to load job history');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        window.location.href = '/';
    };

    const handleViewJobDetails = (job) => {
        setSelectedJob(job);
        setShowJobDetailsModal(true);
    };
    
    const handleCancelJob = async (jobId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/jobs/${jobId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: 'cancelled' })
            });
            
            if (!response.ok) {
                throw new Error('Failed to cancel job');
            }
            
            // Refresh jobs
            fetchJobs();
            setShowJobDetailsModal(false);
        } catch (error) {
            console.error('Error cancelling job:', error);
            setError(error.message);
        }
    };
    
    const handleSubmitReview = () => {
        fetchJobs();
    };
    
    const handleUpdateSettings = (updatedUser) => {
        setUser(updatedUser);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Dashboard Navbar */}
            <nav className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-[#133E87]">Dashboard</h1>
                        </div>

                        <div className="flex items-center space-x-4">
                            <button
                                className="bg-[#133E87] text-white px-4 py-2 rounded-lg hover:bg-[#133E87]/90 transition-colors flex items-center space-x-2"
                                onClick={() => setShowPostingModal(true)}
                            >
                                <Plus size={20} />
                                <span>Post Job</span>
                            </button>

                            <div className="relative" ref={dropdownRef}>
                                <button
                                    className="p-2 hover:bg-gray-100 rounded-full flex items-center space-x-2"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                >
                                    <User size={24} className="text-[#133E87]" />
                                    <span className="text-gray-700">{user?.name}</span>
                                </button>
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1">
                                        <button
                                            onClick={() => {
                                                setShowSettingsModal(true);
                                                setIsDropdownOpen(false);
                                            }}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Settings
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

         {/* Dashboard Content */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Info/Greeting Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                        Welcome back, {user?.name}!
                    </h2>
                    <p className="text-gray-600 mt-1">{user?.email}</p>
                    {user?.phone && (
                        <p className="text-gray-600 mt-1 flex items-center">
                            <Phone size={14} className="mr-1" />
                            {user.phone}
                        </p>
                    )}
                </div>
                <button
                    onClick={() => setShowSettingsModal(true)}
                    className="text-[#133E87] hover:text-[#133E87]/80 transition-colors"
                    title="Edit Profile Settings"
                >
                    <Settings size={20} />
                </button>
            </div>
        </div>

        {/* Job History */}
        <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Job History</h2>
            </div>

            {error ? (
                <div className="p-6 text-red-600">{error}</div>
            ) : isLoading ? (
                <div className="p-6 text-center text-gray-600">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#133E87] border-t-transparent mx-auto mb-2"></div>
                    Loading job history...
                </div>
            ) : jobs.length === 0 ? (
                <div className="p-6 text-center text-gray-600">
                    <FileText size={32} className="mx-auto mb-2 text-gray-400" />
                    <p>You haven't posted any jobs yet</p>
                    <button
                        onClick={() => setShowPostingModal(true)}
                        className="mt-3 text-[#133E87] hover:underline"
                    >
                        Post your first job
                    </button>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Job
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Budget
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {jobs.map((job) => (
                                <tr key={job._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{job.title}</div>
                                                <div className="text-sm text-gray-500">{job.category}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${job.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                                            ${job.status === 'in progress' ? 'bg-blue-100 text-blue-800' : ''}
                                            ${job.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                                            ${job.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                                        `}>
                                            {job.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(job.deadline).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        ₹{job.budget}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleViewJobDetails(job)}
                                            className="text-[#133E87] hover:text-[#0c2654]"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    </div>

    {/* Modals */}
    <JobPostingModal
        isOpen={showPostingModal}
        onClose={() => setShowPostingModal(false)}
        onSuccess={() => {
            fetchJobs();
        }}
    />

    <JobDetailsModal
        isOpen={showJobDetailsModal}
        onClose={() => setShowJobDetailsModal(false)}
        job={selectedJob}
        onSubmitReview={handleSubmitReview}
        onCancelJob={handleCancelJob}
    />

    <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        user={user}
        onUpdateSettings={handleUpdateSettings}
    />
</div>
);
}

export default UserDashboard;