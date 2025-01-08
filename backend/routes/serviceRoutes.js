// routes/serviceRoutes.js
const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceControllers');
const { protectUser } = require('../middleware/authMiddleware');

router.post('/create', protectUser, serviceController.createService);
router.get('/', serviceController.getAllServices);
router.get('/:id', serviceController.getServiceById);
router.put('/:id', protectUser, serviceController.updateService);
router.delete('/:id', protectUser, serviceController.deleteService);

module.exports = router;