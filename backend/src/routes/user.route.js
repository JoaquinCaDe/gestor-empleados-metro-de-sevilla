const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticateToken, authenticateUser } = require('../middleware/auth.middleware');

// Public routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// Protected routes
router.get('/profile', authenticateToken, userController.getUserProfile);
router.get('/all', authenticateToken, userController.getAllUsers);
router.put('/update/:id', authenticateToken, authenticateUser, userController.updateUser);
router.put('/password', authenticateToken, userController.updatePassword);
router.put('/deactivate/:id', authenticateToken, userController.deactivateUser);

module.exports = router;
