// controllers/serviceProviderController.js
const ServiceProvider = require('../models/serviceProvider');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerProvider = async (req, res) => {
    try {
        const { name, description, experience, contactNo, address, services } = req.body;
        
        const provider = new ServiceProvider({
            name,
            description,
            experience,
            contactNo,
            address,
            services
        });

        await provider.save();
        
        const token = jwt.sign({ id: provider._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({ token, provider });
    } catch (error) {
        res.status(500).json({ message: 'Error registering provider', error: error.message });
    }
};

exports.getAllProviders = async (req, res) => {
    try {
        const providers = await ServiceProvider.find().populate('services');
        res.status(200).json(providers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching providers', error: error.message });
    }
};

exports.getProviderById = async (req, res) => {
    try {
        const provider = await ServiceProvider.findById(req.params.id).populate('services');
        if (!provider) return res.status(404).json({ message: 'Provider not found' });
        res.status(200).json(provider);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching provider', error: error.message });
    }
};

exports.updateProvider = async (req, res) => {
    try {
        const provider = await ServiceProvider.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate('services');
        if (!provider) return res.status(404).json({ message: 'Provider not found' });
        res.status(200).json(provider);
    } catch (error) {
        res.status(500).json({ message: 'Error updating provider', error: error.message });
    }
};

exports.deleteProvider = async (req, res) => {
    try {
        const provider = await ServiceProvider.findByIdAndDelete(req.params.id);
        if (!provider) return res.status(404).json({ message: 'Provider not found' });
        res.status(200).json({ message: 'Provider deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting provider', error: error.message });
    }
};