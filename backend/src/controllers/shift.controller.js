import Shift from '../models/shift.model.js';
import User from '../models/user.model.js';
import { scheduleShiftReminders, cancelShiftReminders, getActiveRemindersCount, getActiveReminders } from '../jobs/scheduler.js';
import { sendShiftReminder } from '../lib/email.js';

// Create a new shift
const createShift = async (req, res) => {
  try {
    const { start, end, title, type, employee, testMode, quickTest } = req.body;

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

    await shift.save();    // Schedule reminder emails
    try {
      const isQuickTest = testMode || quickTest;
      console.log(`📅 Scheduling reminders for shift ${shift._id}`);
      console.log(`📅 Quick test mode: ${isQuickTest}`);

      const scheduled = scheduleShiftReminders(shift, isQuickTest);

      if (scheduled) {
        console.log(`✅ Reminders scheduled successfully for shift ${shift._id}`);
      } else {
        console.log(`⚠️ Failed to schedule reminders for shift ${shift._id}`);
      }
    } catch (emailError) {
      console.error('Warning: Failed to schedule shift reminders:', emailError);
      // Don't fail the shift creation if email scheduling fails
    }

    let responseMessage = 'Shift created successfully';
    if (testMode) responseMessage = 'Test shift created successfully with test reminders';
    if (quickTest) responseMessage = 'Shift created successfully with quick test reminders (30s, 1min)';

    res.status(201).json({
      message: responseMessage,
      shift,
      testMode: testMode || false,
      quickTest: quickTest || false
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
    }    // Update fields
    if (start) shift.start = start;
    if (end) shift.end = end;
    if (title) shift.title = title;
    if (type) shift.type = type;
    if (employee) shift.employee = employee;

    await shift.save();    // Cancel old reminder jobs and reschedule
    try {
      cancelShiftReminders(shift._id);
      scheduleShiftReminders(shift);
    } catch (emailError) {
      console.error('Warning: Failed to reschedule shift reminders:', emailError);
      // Don't fail the shift update if email scheduling fails
    }

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
    }    // Cancel any scheduled reminder jobs for this shift
    try {
      cancelShiftReminders(shift._id);
    } catch (emailError) {
      console.error('Warning: Failed to cancel shift reminders:', emailError);
      // Don't fail the shift deletion if email cancellation fails
    }

    res.status(200).json({ message: 'Shift deleted successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting shift',
      error: error.message
    });
  }
};

// Create a test shift with very short reminder intervals
const createTestShift = async (req, res) => {
  try {
    const { employee, minutesFromNow = 5 } = req.body;

    // Validate employee exists
    const employeeExists = await User.findById(employee);
    if (!employeeExists) {
      return res.status(400).json({ message: 'Employee not found' });
    }    // Create a test shift starting in X minutes from now
    const now = new Date();
    const shiftStart = new Date(now.getTime() + minutesFromNow * 60 * 1000);
    const shiftEnd = new Date(shiftStart.getTime() + 2 * 60 * 60 * 1000); // 2 hours duration

    const shift = new Shift({
      start: shiftStart,
      end: shiftEnd,
      title: `🧪 TEST SHIFT - ${minutesFromNow}min`,
      type: 'morning', // Using valid enum value instead of 'test'
      employee
    });

    await shift.save();    // Schedule test reminder emails
    try {
      console.log('🧪 Creating test shift with quick test reminders (30s, 1min)');
      scheduleShiftReminders(shift, true); // true = isQuickTest
    } catch (emailError) {
      console.error('Warning: Failed to schedule test shift reminders:', emailError);
    }

    res.status(201).json({
      message: `Test shift created successfully! Reminders will be sent in 30s and 1min`,
      shift,
      testMode: true,
      reminderSchedule: {
        '30seconds': new Date(now.getTime() + 30 * 1000).toLocaleString(),
        '1minute': new Date(now.getTime() + 60 * 1000).toLocaleString()
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error creating test shift',
      error: error.message
    });
  }
};

// Get scheduler status and active reminders
const getScheduledJobs = async (req, res) => {
  try {
    const activeCount = getActiveRemindersCount();
    const activeReminders = getActiveReminders();

    res.status(200).json({
      message: 'Scheduler status retrieved successfully',
      schedulerType: 'setTimeout-based',
      totalActiveReminders: activeCount,
      activeReminders: activeReminders,
      status: 'running'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving scheduler status',
      error: error.message
    });
  }
};

// Test function to verify email functionality
const testEmailNow = async (req, res) => {
  try {
    console.log('🧪 Testing email functionality immediately...');

    const testShiftData = {
      title: '🧪 TEST EMAIL - Immediate',
      start: new Date(),
      end: new Date(Date.now() + 2 * 60 * 60 * 1000),
      employeeName: 'Test User'
    };

    await sendShiftReminder('test@example.com', testShiftData);

    res.status(200).json({
      message: 'Test email sent successfully',
      timestamp: new Date().toLocaleString()
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error sending test email',
      error: error.message
    });
  }
};

export { createShift, getAllShifts, getShiftById, getShiftsByEmployee, updateShift, deleteShift, createTestShift, getScheduledJobs, testEmailNow };