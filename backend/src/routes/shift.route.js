import express from 'express';
import * as shiftController from '../controllers/shift.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// All shift routes require authentication
router.use(authenticateToken);

// Create new shift
router.post('/', shiftController.createShift);

// TEST ENDPOINTS - Create test shift with immediate reminders
router.post('/test', shiftController.createTestShift);

// Get scheduled jobs status
router.get('/jobs', shiftController.getScheduledJobs);

// Test email functionality (send immediate email)
router.post('/test-email', shiftController.testEmailNow);

// Get all shifts for current user
router.get('/', shiftController.getAllShifts);

// Get shift by ID
router.get('/:id', shiftController.getShiftById);

// Update shift
router.put('/:id', shiftController.updateShift);

// Delete shift
router.delete('/:id', shiftController.deleteShift);

export default router;