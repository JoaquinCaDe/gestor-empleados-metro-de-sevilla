const Shift = require('../models/shift.model');
const User = require('../models/user.model');

// Create a new shift
const createShift = async (req, res) => {
  try {
    const { start, end, title, type, employee } = req.body;

    // Validate employee exists
    const employeeExists = await User.findById(employee);
    if (!employeeExists) {
      return res.status(400).json({ message: 'Employee not found' });
    }

    // Create new shift
    const shift = new Shift({
      start,
      end,
      title,
      type,
      employee
    });

    await shift.save();

    res.status(201).json({
      message: 'Shift created successfully',
      shift
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error creating shift',
      error: error.message
    });
  }
};

// Get all shifts
const getAllShifts = async (req, res) => {
  try {
    const { startDate, endDate, employee, type } = req.query;
    let query = {};

    // Apply filters if provided
    if (startDate && endDate) {
      query.start = { $gte: new Date(startDate) };
      query.end = { $lte: new Date(endDate) };
    }

    if (employee) {
      query.employee = employee;
    }

    if (type) {
      query.type = type;
    }

    // Execute query with filtering
    const shifts = await Shift.find(query)
      .populate('employee', 'name username email')
      .sort({ start: 1 });

    res.status(200).json({ shifts });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching shifts',
      error: error.message
    });
  }
};

// Get shift by ID
const getShiftById = async (req, res) => {
  try {
    const shift = await Shift.findById(req.params.id)
      .populate('employee', 'name username email');

    if (!shift) {
      return res.status(404).json({ message: 'Shift not found' });
    }

    res.status(200).json({ shift });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching shift',
      error: error.message
    });
  }
};

// Get shifts by employee
const getShiftsByEmployee = async (req, res) => {
  try {
    const { startDate, endDate, type } = req.query;
    let query = { employee: req.params.employeeId };

    // Apply filters if provided
    if (startDate && endDate) {
      query.start = { $gte: new Date(startDate) };
      query.end = { $lte: new Date(endDate) };
    }

    if (type) {
      query.type = type;
    }

    const shifts = await Shift.find(query)
      .populate('employee', 'name username email')
      .sort({ start: 1 });

    res.status(200).json({ shifts });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching employee shifts',
      error: error.message
    });
  }
};

// Update shift
const updateShift = async (req, res) => {
  try {
    const { start, end, title, type, employee } = req.body;

    // Find shift
    const shift = await Shift.findById(req.params.id);
    if (!shift) {
      return res.status(404).json({ message: 'Shift not found' });
    }

    // If employee is being changed, verify the new employee exists
    if (employee && employee !== shift.employee.toString()) {
      const employeeExists = await User.findById(employee);
      if (!employeeExists) {
        return res.status(400).json({ message: 'Employee not found' });
      }
    }

    // Update fields
    if (start) shift.start = start;
    if (end) shift.end = end;
    if (title) shift.title = title;
    if (type) shift.type = type;
    if (employee) shift.employee = employee;

    await shift.save();

    res.status(200).json({
      message: 'Shift updated successfully',
      shift
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating shift',
      error: error.message
    });
  }
};

// Delete shift
const deleteShift = async (req, res) => {
  try {
    const shift = await Shift.findByIdAndDelete(req.params.id);

    if (!shift) {
      return res.status(404).json({ message: 'Shift not found' });
    }

    res.status(200).json({ message: 'Shift deleted successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting shift',
      error: error.message
    });
  }
};

module.exports = {
  createShift,
  getAllShifts,
  getShiftById,
  getShiftsByEmployee,
  updateShift,
  deleteShift
};