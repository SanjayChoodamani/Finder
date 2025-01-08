// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers');
const { protectUser } = require('../middleware/authMiddleware');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/profile', protectUser, userController.getUserProfile);
router.put('/update', protectUser, userController.updateUser);
router.delete('/delete', protectUser, userController.deleteUser);

module.exports = router;