import express from 'express';
const router = express.Router();
import * as userController from '../controllers/user.controller.js';
import { authenticateToken, authenticateUser } from '../middleware/auth.middleware.js';

// Public routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// Protected routes
router.get('/profile', authenticateToken, userController.getUserProfile);
router.get('/all', authenticateToken, userController.getAllUsers);
router.put('/update/:id', authenticateToken, authenticateUser, userController.updateUser);
router.put('/password', authenticateToken, userController.updatePassword);
router.put('/deactivate/:id', authenticateToken, userController.deactivateUser);

export default router;
