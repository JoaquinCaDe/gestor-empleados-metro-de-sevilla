const express = require('express');
const router = express.Router();
const shiftController = require('../controllers/shift.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// All shift routes require authentication
router.use(authenticateToken);

// Create new shift
router.post('/', shiftController.createShift);

// Get all shifts for current user
router.get('/', shiftController.getAllShifts);

// Get shift by ID
router.get('/:id', shiftController.getShiftById);

// Update shift
router.put('/:id', shiftController.updateShift);

// Delete shift
router.delete('/:id', shiftController.deleteShift);

module.exports = router;