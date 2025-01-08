const jwt = require('jsonwebtoken');

// Middleware to protect routes for users
exports.protectUser = (req, res, next) => {
    try {
        // Get token from headers
        const token = req.header('Authorization').replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        // Verify token
        const decoded = jwt.verify(token, 'your_jwt_secret');
        req.userId = decoded.id;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid', error });
    }
};

// Middleware to protect routes for service providers
exports.protectProvider = (req, res, next) => {
    try {
        // Get token from headers
        const token = req.header('Authorization').replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        // Verify token
        const decoded = jwt.verify(token, 'your_jwt_secret');
        req.providerId = decoded.id;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid', error });
    }
};