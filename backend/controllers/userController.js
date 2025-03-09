const User = require('../models/User');
const Worker = require('../models/Worker');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');

// Register User - Client or Worker
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, phone, address, userType, skills, experience, city, cityLatitude, cityLongitude } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered' });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password, // Model will hash this
            phone,
            address,
            userType,
            city
        });

        // Create worker profile if userType is 'worker'
        if (userType === 'worker') {
            const workerData = {
                user: user._id,
                skills: skills || [],
                experience: experience || 0,
                serviceRadius: 10, // Default 10km radius
                city: city || '',
                location: {
                    type: 'Point',
                    coordinates: [parseFloat(cityLongitude) || 0, parseFloat(cityLatitude) || 0]
                }
            };
            
            await Worker.create(workerData);
        }

        // Generate token
        const token = jwt.sign(
            { _id: user._id.toString() },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                userType: user.userType
            }
        });
    } catch (error) {
        next(new ErrorResponse(error.message, 500));
    }
};

// Login user
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate email & password
        if (!email || !password) {
            return next(new ErrorResponse('Please provide email and password', 400));
        }

        // Check for user
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return next(new ErrorResponse('Invalid credentials', 401));
        }

        // Check if password matches
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return next(new ErrorResponse('Invalid credentials', 401));
        }

        // Generate token
        const token = jwt.sign(
            { _id: user._id.toString() },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Remove password from response
        user.password = undefined;

        res.status(200).json({
            success: true,
            token,
            user
        });
    } catch (error) {
        next(new ErrorResponse(error.message, 500));
    }
};

// Get current user
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        
        // Add worker information if user is a worker
        let additionalData = {};
        if (user.userType === 'worker') {
            const workerProfile = await Worker.findOne({ user: user._id });
            if (workerProfile) {
                additionalData = {
                    skills: workerProfile.skills,
                    experience: workerProfile.experience,
                    serviceRadius: workerProfile.serviceRadius,
                    rating: user.rating,
                    completedJobs: user.completedJobs,
                    location: workerProfile.location
                };
            }
        }
        
        res.status(200).json({
            success: true,
            data: { ...user.toObject(), ...additionalData }
        });
    } catch (error) {
        next(new ErrorResponse(error.message, 500));
    }
};

// Update user profile
exports.updateProfile = async (req, res, next) => {
    try {
        const { name, email, phone, address, currentPassword, newPassword } = req.body;
        
        // Build update object
        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (phone) updateData.phone = phone;
        if (address) updateData.address = address;
        
        // Handle password change
        if (newPassword && currentPassword) {
            // Verify current password
            const user = await User.findById(req.user._id).select('+password');
            const isMatch = await user.comparePassword(currentPassword);
            
            if (!isMatch) {
                return next(new ErrorResponse('Current password is incorrect', 401));
            }
            
            // Hash new password
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(newPassword, salt);
        }
        
        // Update user
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            updateData,
            { new: true, runValidators: true }
        );
        
        res.status(200).json({
            success: true,
            user: updatedUser
        });
    } catch (error) {
        next(new ErrorResponse(error.message, 500));
    }
};

// Update worker profile
exports.updateWorkerProfile = async (req, res, next) => {
    try {
        if (req.user.userType !== 'worker') {
            return next(new ErrorResponse('Not authorized to update worker profile', 403));
        }
        
        const { skills, serviceRadius, city, cityLatitude, cityLongitude } = req.body;
        
        // Build update object
        const updateData = {};
        if (skills && Array.isArray(skills)) {
            updateData.skills = skills.map(skill => skill.toLowerCase().trim());
            // The Worker model's pre-save hook will handle setting categories based on skills
        }
        if (serviceRadius) updateData.serviceRadius = serviceRadius;
        if (city) updateData.city = city;
        if (cityLatitude && cityLongitude) {
            updateData.location = {
                type: 'Point',
                coordinates: [parseFloat(cityLongitude), parseFloat(cityLatitude)]
            };
        }
        
        // Update worker profile
        const worker = await Worker.findOneAndUpdate(
            { user: req.user._id },
            updateData,
            { new: true, runValidators: true }
        );
        
        if (!worker) {
            return next(new ErrorResponse('Worker profile not found', 404));
        }
        
        res.status(200).json({
            success: true,
            data: worker
        });
    } catch (error) {
        next(new ErrorResponse(error.message, 500));
    }
};