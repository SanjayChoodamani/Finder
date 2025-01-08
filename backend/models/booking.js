// models/booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    mobileNo: { type: String, required: true },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceProvider', required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: {
        address: { type: String, required: true },
        city: { type: String },
        zipCode: { type: String }
    },
    status: { type: String, default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);