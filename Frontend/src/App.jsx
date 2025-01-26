import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import UserDashboard from './components/dashboard/UserDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import WorkerDashboard from './components/dashboard/WorkerDashboard';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                
                <Route 
                    path="/client/dashboard" 
                    element={
                        <ProtectedRoute allowedUserType="client">
                            <UserDashboard />
                        </ProtectedRoute>
                    } 
                />
                
                <Route 
                    path="/worker/dashboard" 
                    element={
                        <ProtectedRoute allowedUserType="worker">
                            <WorkerDashboard />
                        </ProtectedRoute>
                    } 
                />

                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
};

export default App;