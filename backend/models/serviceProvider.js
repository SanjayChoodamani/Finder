// models/serviceProvider.js
const mongoose = require('mongoose');

const serviceProviderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    experience: { type: Number },
    contactNo: { type: String, required: true },
    address: { type: String, required: true },
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
    rating: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('ServiceProvider', serviceProviderSchema);