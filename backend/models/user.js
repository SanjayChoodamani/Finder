const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        enum: ['client', 'worker'],
        required: true
    },
    // Worker specific fields
    skills: {
        type: String,
        required: function() {
            return this.userType === 'worker';
        }
    },
    experience: {
        type: Number,
        required: function() {
            return this.userType === 'worker';
        }
    },
    serviceArea: {
        type: String,
        required: function() {
            return this.userType === 'worker';
        }
    },
    rating: {
        type: Number,
        default: 0
    },
    completedJobs: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

userSchema.methods.comparePassword = async function(password) {
    return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
