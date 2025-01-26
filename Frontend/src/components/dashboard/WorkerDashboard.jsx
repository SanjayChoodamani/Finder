// components/dashboard/WorkerDashboard.js
import React, { useState, useEffect, useRef } from 'react';
import { Bell, LogOut, Settings, User, X } from 'lucide-react';
import AvailableJobsList from './AvailableJobsList';
import NotificationPanel from './NotificationPanel';
import ActiveJobsList from './ActiveJobsList';

const WorkerDashboard = () => {
    const [user, setUser] = useState(null);
    const [availableJobs, setAvailableJobs] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [activeJobs, setActiveJobs] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        fetchUserData();
        fetchAvailableJobs();
        fetchNotifications();
        fetchActiveJobs();
        setupLocationUpdates();
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const setupLocationUpdates = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.watchPosition(
                async (position) => {
                    try {
                        const token = localStorage.getItem('token');
                        await fetch('http://localhost:5000/api/worker/location', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                longitude: position.coords.longitude,
                                latitude: position.coords.latitude
                            })
                        });
                    } catch (error) {
                        console.error('Error updating location:', error);
                    }
                },
                (error) => {
                    console.error('Error getting location:', error);
                },
                {
                    enableHighAccuracy: true,
                    maximumAge: 30000,
                    timeout: 27000
                }
            );
        }
    };

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
            }
        } catch (error) {
            setError('Failed to load user data');
        }
    };

    const fetchAvailableJobs = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/worker/available-jobs', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setAvailableJobs(data);
            }
        } catch (error) {
            setError('Failed to load available jobs');
        }
    };

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/worker/notifications', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setNotifications(data);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const fetchActiveJobs = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/jobs/my-assignments', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setActiveJobs(data);
            }
        } catch (error) {
            console.error('Error fetching active jobs:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        window.location.href = '/';
    };

    const markNotificationAsRead = async (notificationId) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`http://localhost:5000/api/worker/notifications/${notificationId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            fetchNotifications();
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-[#133E87]">
                                Worker Dashboard
                            </h1>
                        </div>

                        <div className="flex items-center space-x-4">
                            <button
                                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                                onClick={() => setShowNotifications(!showNotifications)}
                            >
                                <Bell size={24} className="text-[#133E87]" />
                                {notifications.some(n => !n.isRead) && (
                                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full ring-2 ring-white"></span>
                                )}
                            </button>

                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <User size={24} className="text-[#133E87]" />
                                    <span className="text-gray-700">{user?.name}</span>
                                </button>

                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                                        <div className="px-4 py-3 border-b border-gray-200">
                                            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                            <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                                        </div>

                                        <div className="py-1">
                                            <button
                                                onClick={() => {
                                                    // Add profile navigation here
                                                    console.log('Navigate to profile');
                                                }}
                                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                <User size={16} className="mr-2" />
                                                Profile
                                            </button>

                                            <button
                                                onClick={() => {
                                                    // Add settings navigation here
                                                    console.log('Navigate to settings');
                                                }}
                                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                <Settings size={16} className="mr-2" />
                                                Settings
                                            </button>
                                        </div>

                                        <div className="py-1 border-t border-gray-200">
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                            >
                                                <LogOut size={16} className="mr-2" />
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Worker Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-800">Rating</h3>
                            <span className="text-2xl font-bold text-[#133E87]">
                                {user?.rating?.toFixed(1) || 'N/A'}
                            </span>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-800">Completed Jobs</h3>
                            <span className="text-2xl font-bold text-[#133E87]">
                                {user?.completedJobs || 0}
                            </span>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-800">Active Jobs</h3>
                            <span className="text-2xl font-bold text-[#133E87]">
                                {activeJobs.length}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Available Jobs Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-md">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-800">Available Jobs</h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    Jobs matching your skills in your area
                                </p>
                            </div>
                            <div className="p-6">
                                <AvailableJobsList
                                    jobs={availableJobs}
                                    onAccept={fetchActiveJobs}
                                    isLoading={isLoading}
                                />
                            </div>
                        </div>

                        {/* Active Jobs Section */}
                        <div className="bg-white rounded-lg shadow-md mt-8">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-800">Active Jobs</h2>
                            </div>
                            <div className="p-6">
                                <ActiveJobsList
                                    jobs={activeJobs}
                                    onStatusUpdate={fetchActiveJobs}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Notifications Side Panel */}
                    <div
                        className={`fixed inset-y-0 right-0 w-96 bg-white shadow-lg transform transition-all duration-300 ease-in-out z-10  ${showNotifications ? 'translate-x-0' : 'translate-x-full'} lg:relative lg:w-auto lg:transform-none lg:translate-x-0`}
                    >
                        {/* Overlay for mobile */}
                        {showNotifications && (
                            <div
                                className="fixed inset-0 bg-black bg-opacity-50 lg:hidden"
                                onClick={() => setShowNotifications(false)}
                            />
                        )}

                        <div className="relative h-full">
                            {/* Header */}
                            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                                <h2 className="text-xl font-semibold text-gray-800">Notifications</h2>
                                <button
                                    className="lg:hidden text-gray-500 hover:text-gray-700"
                                    onClick={() => setShowNotifications(false)}
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Notifications Content */}
                            <div className="p-6 overflow-y-auto max-h-[calc(100vh-5rem)]">
                                <NotificationPanel
                                    notifications={notifications}
                                    onMarkAsRead={markNotificationAsRead}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkerDashboard;



