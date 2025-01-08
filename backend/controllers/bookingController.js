// controllers/bookingController.js
const Booking = require('../models/booking');
const Service = require('../models/service');
const ServiceProvider = require('../models/serviceProvider');

exports.createBooking = async (req, res) => {
    try {
        const { customerName, mobileNo, serviceId, providerId, date, time, location } = req.body;
        
        // Validate service and provider
        const [service, provider] = await Promise.all([
            Service.findById(serviceId),
            ServiceProvider.findById(providerId)
        ]);
        
        if (!service || !provider) {
            return res.status(404).json({ message: 'Service or Provider not found' });
        }

        const booking = new Booking({
            customerName,
            mobileNo,
            serviceId,
            providerId,
            date,
            time,
            location
        });

        await booking.save();
        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Error creating booking', error: error.message });
    }
};

exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('serviceId')
            .populate('providerId');
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bookings', error: error.message });
    }
};

exports.getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('serviceId')
            .populate('providerId');
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching booking', error: error.message });
    }
};

exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Error updating booking', error: error.message });
    }
};

exports.deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        res.status(200).json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error cancelling booking', error: error.message });
    }
};