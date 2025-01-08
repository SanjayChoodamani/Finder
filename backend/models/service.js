// models/service.js
const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    serviceId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true },
    providerCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);