import React from 'react';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

// components/dashboard/NotificationPanel.js
const NotificationPanel = ({ notifications, onMarkAsRead }) => {
    if (notifications.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">No notifications</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {notifications.map((notification) => (
                <div
                    key={notification._id}
                    className={`p-4 rounded-lg ${notification.isRead ? 'bg-gray-50' : 'bg-blue-50'}`}
                >
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            {notification.type === 'new_job' ? (
                                <AlertCircle className="text-blue-500" size={20} />
                            ) : (
                                <Clock className="text-yellow-500" size={20} />
                            )}
                        </div>
                        <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-gray-900">
                                {notification.message}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                                {new Date(notification.createdAt).toLocaleString()}
                            </p>
                        </div>
                        {!notification.isRead && (
                            <button
                                onClick={() => onMarkAsRead(notification._id)}
                                className="ml-2 text-blue-600 hover:text-blue-800"
                            >
                                <CheckCircle size={16} />
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default NotificationPanel;