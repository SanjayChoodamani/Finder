// components/dashboard/WorkerDashboard.js
import React, { useState, useEffect, useRef } from 'react';
import { Bell, LogOut, Settings, User, X, MapPin } from 'lucide-react';
import NotificationPanel from './NotificationPanel';
import ActiveJobsList from './ActiveJobsList';
import JobCard from './JobCard';

const WorkerDashboard = () => {
    const [user, setUser] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [activeJobs, setActiveJobs] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [nearbyJobs, setNearbyJobs] = useState([]);
    const [pushEnabled, setPushEnabled] = useState(false);

    // Add loading states
    const [dashboardLoading, setDashboardLoading] = useState({
        profile: true,
        nearbyJobs: true,
        activeJobs: true,
        notifications: true
    });

    useEffect(() => {
        // Initialize everything at once
        initializeDashboard();

        // Set up click outside handler for dropdown
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const initializeDashboard = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // First fetch essential user data
            await fetchUserData();

            // Then fetch other data in parallel, but handle failures gracefully
            const results = await Promise.allSettled([
                fetchNotifications(),
                fetchNearbyJobs(),
                fetchActiveJobs()
            ]);

            // Log any rejections but don't fail the dashboard
            results.forEach((result, index) => {
                if (result.status === 'rejected') {
                    const endpoints = ['notifications', 'nearby jobs', 'active jobs'];
                    console.warn(`Failed to fetch ${endpoints[index]}:`, result.reason);
                }
            });

            // Ensure worker profile exists
            try {
                const token = localStorage.getItem('token');
                await fetch('http://localhost:5000/api/worker/ensure-profile', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ skills: ['general'] })
                });
            } catch (err) {
                console.warn('Error ensuring worker profile:', err);
            }
            
            // Try setting up push notifications but don't block if it fails
            try {
                await setupPushNotifications();
            } catch (pushError) {
                console.warn('Push notification setup failed:', pushError);
                // Non-critical
            }
        } catch (error) {
            console.error('Error initializing dashboard:', error);
            setError('Failed to load dashboard data. Please try again later.');
        } finally {
            setIsLoading(false);
            setDashboardLoading({
                profile: false,
                nearbyJobs: false,
                activeJobs: false,
                notifications: false
            });
        }
    };

    const checkLocationAvailability = async (jobId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/worker/job-location/${jobId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                // Location is available
                return {
                    available: true,
                    location: data.exactLocation,
                    address: data.exactAddress
                };
            } else {
                // Location not yet available
                return {
                    available: false,
                    message: data.message,
                    revealTime: data.revealTime ? new Date(data.revealTime) : null
                };
            }
        } catch (error) {
            console.error('Error checking location availability:', error);
            return {
                available: false,
                message: 'Error checking location availability'
            };
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
            } else {
                throw new Error('Failed to fetch profile data');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setDashboardLoading(prev => ({ ...prev, profile: false }));
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

            // If response is not ok, just set empty notifications instead of throwing
            if (!response.ok) {
                console.log('No notifications found or worker profile not set up');
                setNotifications([]);
                return;
            }

            const result = await response.json();

            if (result.success) {
                setNotifications(result.data || []);
            } else {
                setNotifications([]);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
            // Don't set error state here, just set empty notifications
            setNotifications([]);
        } finally {
            setDashboardLoading(prev => ({ ...prev, notifications: false }));
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
            } else {
                throw new Error('Failed to fetch active jobs');
            }
        } catch (error) {
            console.error('Error fetching active jobs:', error);
        } finally {
            setDashboardLoading(prev => ({ ...prev, activeJobs: false }));
            setIsLoading(false);
        }
    };

    const fetchNearbyJobs = async () => {
        try {
            setDashboardLoading(prev => ({ ...prev, nearbyJobs: true }));
            const token = localStorage.getItem('token');

            console.log('Fetching nearby jobs...');
            // Updated URL to point directly to the worker endpoint
            const response = await fetch('http://localhost:5000/api/worker/nearby-jobs', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            console.log('Nearby jobs response:', data);

            if (data && Array.isArray(data.data)) {
                setNearbyJobs(data.data);
                console.log(`Found ${data.data.length} nearby jobs`);
                data.data.forEach((job, index) => {
                    console.log(`Job ${index + 1}:`, {
                        id: job._id,
                        title: job.title,
                        category: job.category,
                        approxLocation: job.approximateLocation || 'No location'
                    });
                });
            } else {
                console.error('Invalid response format for nearby jobs');
                setNearbyJobs([]);
            }
        } catch (error) {
            console.error('Error fetching nearby jobs:', error);
            setNearbyJobs([]);
        } finally {
            setDashboardLoading(prev => ({ ...prev, nearbyJobs: false }));
        }
    };

    useEffect(() => {
        // Log nearby jobs for debugging
        if (nearbyJobs.length > 0) {
            console.log(`Found ${nearbyJobs.length} nearby jobs`);
            nearbyJobs.forEach((job, index) => {
                console.log(`Job ${index + 1}:`, {
                    id: job._id,
                    title: job.title,
                    category: job.category,
                    approxLocation: job.approximateLocation || 'No approximate location'
                });
            });
        } else if (!dashboardLoading.nearbyJobs) {
            console.log('No nearby jobs found');
        }
    }, [nearbyJobs, dashboardLoading.nearbyJobs]);

    const setupPushNotifications = async () => {
        try {
            if (!('Notification' in window)) {
                console.log('This browser does not support notifications');
                return false;
            }

            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                console.log('Notification permission denied');
                return false;
            }

            if (!navigator.serviceWorker) {
                console.log('Service Worker not supported');
                return false;
            }

            // Check if VAPID key exists and use a fallback if not
            const vapidKey = import.meta.env.VITE_REACT_APP_VAPID_PUBLIC_KEY;
            if (!vapidKey) {
                console.warn('VAPID public key not found in environment variables');
                // Just return false instead of trying to create a subscription
                return false;
            }

            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: vapidKey
            });

            // Send subscription to server
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/worker/push-subscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ subscription })
            });

            if (response.ok) {
                setPushEnabled(true);
                return true;
            }
            return false;
        } catch (err) {
            console.error('Error setting up push notifications:', err);
            return false;
        }
    };

    const handleAcceptJob = async (jobId) => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('token');

            console.log(`Accepting job ${jobId}...`);

            const response = await fetch(`http://localhost:5000/api/jobs/${jobId}/accept`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const responseText = await response.text();
            console.log('Response text:', responseText);

            let data;
            try {
                data = JSON.parse(responseText);
            } catch (e) {
                throw new Error(`Invalid JSON response: ${responseText}`);
            }

            if (!response.ok) {
                throw new Error(data.message || 'Failed to accept job');
            }

            // Refresh all job lists to ensure UI is updated
            await Promise.all([
                fetchNearbyJobs(),
                fetchActiveJobs()
            ]);

            // Show confirmation
            alert('Job accepted successfully! Check your active jobs.');
        } catch (err) {
            console.error('Error accepting job:', err);
            alert(`Error: ${err.message}`);
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

    // Loading component
    const LoadingSpinner = () => (
        <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#133E87] border-t-transparent"></div>
        </div>
    );

    // Empty state component
    const EmptyState = ({ title, message }) => (
        <div className="text-center py-8">
            <MapPin className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">{title}</h3>
            <p className="mt-1 text-sm text-gray-500">{message}</p>
        </div>
    );

    // Update the render method to handle loading states
    if (Object.values(dashboardLoading).every(Boolean)) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (isLoading) return <div>Loading...</div>;
    if (error) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50">
                <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Dashboard Error</h2>
                    <p className="text-gray-700 mb-6">{error}</p>
                    <div className="flex space-x-4">
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-[#133E87] text-white py-2 px-4 rounded-lg hover:bg-[#133E87]/90 transition-colors"
                        >
                            Retry Loading
                        </button>
                        <button
                            onClick={() => {
                                localStorage.removeItem('token');
                                window.location.href = '/';
                            }}
                            className="border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        );
    }

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

                {/* Jobs Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Available Jobs */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-md">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-800">Available Jobs</h2>
                            </div>
                            <div className="p-6">
                                {dashboardLoading.nearbyJobs ? (
                                    <LoadingSpinner />
                                ) : nearbyJobs.length > 0 ? (
                                    <div className="grid gap-4">
                                        {nearbyJobs.map(job => (
                                            <div key={job._id}>
                                                <JobCard job={job} />
                                                <button
                                                    onClick={() => handleAcceptJob(job._id)}
                                                    className="mt-2 w-full bg-[#133E87] text-white py-2 px-4 rounded-lg hover:bg-[#133E87]/90 transition-colors"
                                                >
                                                    Accept Job
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <EmptyState
                                        title="No jobs available"
                                        message="There are currently no jobs in your area. Check back later!"
                                    />
                                )}
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
                                    checkLocationAvailability={checkLocationAvailability}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Notifications Panel */}
                    <div
                        className={`fixed inset-y-0 right-0 w-96 bg-white shadow-lg transform transition-all duration-300 ease-in-out z-10 ${showNotifications ? 'translate-x-0' : 'translate-x-full'} lg:relative lg:w-auto lg:transform-none lg:translate-x-0`}
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

                {/* Nearby Jobs Section */}
                <div className="p-6">
                    <div className="mb-6 flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-800">Available Jobs Nearby</h1>
                        <div className="flex items-center gap-2">
                            <Bell
                                className={pushEnabled ? 'text-green-500' : 'text-gray-400'}
                                size={20}
                            />
                            <span className="text-sm text-gray-600">
                                {pushEnabled ? 'Notifications enabled' : (
                                    <button
                                        onClick={setupPushNotifications}
                                        className="text-[#133E87] hover:underline"
                                    >
                                        Enable notifications
                                    </button>
                                )}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {nearbyJobs.map(job => (
                            <div key={job._id} className="relative">
                                <JobCard job={job} />
                                <button
                                    onClick={() => handleAcceptJob(job._id)}
                                    className="mt-4 w-full bg-[#133E87] text-white py-2 px-4 rounded-lg hover:bg-[#133E87]/90 transition-colors"
                                >
                                    Accept Job
                                </button>
                            </div>
                        ))}
                    </div>

                    {nearbyJobs.length === 0 && (
                        <div className="text-center py-12">
                            <MapPin className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-4 text-gray-600">No jobs available in your area</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WorkerDashboard;