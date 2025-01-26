import React, { useState, useEffect, useRef } from 'react';
import {
    Plus, Settings, LogOut, User, Calendar, MapPin,
    FileText, Image as ImageIcon, Clock, DollarSign
} from 'lucide-react';
import JobPostingModal from './JobPostingModal';
import BookingHistoryTable from './BookingHistoryTable';

const UserDashboard = () => {
    const [showPostingModal, setShowPostingModal] = useState(false);
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
                        </div>
                        <button
                            className="text-[#133E87] hover:text-[#133E87]/80 transition-colors"
                            title="Settings"
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
                        <div className="p-6 text-center text-gray-600">Loading job history...</div>
                    ) : (
                        <BookingHistoryTable jobs={jobs} onRefresh={fetchJobs} />
                    )}
                </div>
            </div>

            {/* Job Posting Modal */}
            <JobPostingModal
                isOpen={showPostingModal}
                onClose={() => setShowPostingModal(false)}
                onSuccess={() => {
                    setShowPostingModal(false);
                    fetchJobs();
                }}
            />
        </div>
    );
};

export default UserDashboard;