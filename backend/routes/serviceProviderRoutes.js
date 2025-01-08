// routes/serviceProviderRoutes.js
const express = require('express');
const router = express.Router();
const providerController = require('../controllers/serviceProviderController');
const { protectProvider } = require('../middleware/authMiddleware');

router.post('/register', providerController.registerProvider);
router.get('/', providerController.getAllProviders);
router.get('/:id', providerController.getProviderById);
router.put('/:id', protectProvider, providerController.updateProvider);
router.delete('/:id', protectProvider, providerController.deleteProvider);

module.exports = router;