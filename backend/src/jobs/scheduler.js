// filepath: backend/src/jobs/scheduler.js
import cron from 'node-cron';
import mongoose from 'mongoose';
import { sendShiftReminder } from '../lib/email.js';
import Shift from '../models/shift.model.js';

// Store active reminder timeouts
const activeReminders = new Map();

/**
 * Schedule shift reminders using setTimeout
 * @param {Object} shift - The shift object
 * @param {boolean} isQuickTest - Whether to use quick test intervals
 */
export const scheduleShiftReminders = (shift, isQuickTest = false) => {
  try {
    const now = new Date();
    const shiftStart = new Date(shift.start);

    console.log(`📅 Scheduling reminders for shift ${shift._id}`);
    console.log(`📅 Current time: ${now.toLocaleString()}`);
    console.log(`📅 Shift start: ${shiftStart.toLocaleString()}`);

    let reminderTimes;

    if (isQuickTest) {
      // Quick test intervals: 30 seconds and 1 minute from now
      reminderTimes = [
        { delay: 30 * 1000, type: '30-second' },     // 30 seconds
        { delay: 60 * 1000, type: '1-minute' }       // 1 minute
      ];
      console.log('⚡ Using QUICK TEST reminder intervals');
    } else {
      // Production intervals: 2 hours and 1 day before shift
      const twoHoursBefore = new Date(shiftStart.getTime() - (2 * 60 * 60 * 1000));
      const oneDayBefore = new Date(shiftStart.getTime() - (24 * 60 * 60 * 1000));

      reminderTimes = [];

      if (twoHoursBefore > now) {
        const delay = twoHoursBefore.getTime() - now.getTime();
        reminderTimes.push({ delay, type: '2-hour', scheduledFor: twoHoursBefore });
      }

      if (oneDayBefore > now) {
        const delay = oneDayBefore.getTime() - now.getTime();
        reminderTimes.push({ delay, type: '1-day', scheduledFor: oneDayBefore });
      }

      console.log('📅 Using PRODUCTION reminder intervals');
    }

    // Schedule each reminder
    reminderTimes.forEach(({ delay, type, scheduledFor }) => {
      const reminderKey = `${shift._id}-${type}`;

      const timeoutId = setTimeout(async () => {
        try {
          console.log(`🔔 Executing ${type} reminder for shift ${shift._id}`);

          // Get fresh shift data from database
          const currentShift = await Shift.findById(shift._id).populate('employee', 'name email');

          if (!currentShift) {
            console.log(`⚠️ Shift ${shift._id} not found, skipping reminder`);
            return;
          }

          if (!currentShift.employee?.email) {
            console.log(`⚠️ No email found for employee in shift ${shift._id}`);
            return;
          }

          // Check if shift hasn't been cancelled or started
          const currentTime = new Date();
          const currentShiftStart = new Date(currentShift.start);

          if (currentShiftStart <= currentTime) {
            console.log(`⚠️ Shift ${shift._id} already started, skipping reminder`);
            return;
          }

          const shiftData = {
            title: currentShift.title,
            start: currentShift.start,
            end: currentShift.end,
            employeeName: currentShift.employee.name,
          };

          console.log(`📧 Sending ${type} reminder email to: ${currentShift.employee.email}`);
          await sendShiftReminder(currentShift.employee.email, shiftData);
          console.log(`✅ ${type} reminder sent successfully for shift ${shift._id}`);

          // Remove from active reminders
          activeReminders.delete(reminderKey);

        } catch (error) {
          console.error(`❌ Error sending ${type} reminder:`, error);
          // Remove from active reminders even on error
          activeReminders.delete(reminderKey);
        }
      }, delay);

      // Store timeout ID for potential cancellation
      activeReminders.set(reminderKey, timeoutId);

      const scheduledTime = scheduledFor || new Date(now.getTime() + delay);
      console.log(`📅 Scheduled ${type} reminder for shift ${shift._id} at ${scheduledTime.toLocaleString()}`);
    });

    console.log(`✅ Successfully scheduled ${reminderTimes.length} reminders for shift ${shift._id}`);
    return true;
  } catch (error) {
    console.error('❌ Error scheduling shift reminders:', error);
    return false;
  }
};

/**
 * Cancel all reminders for a shift
 * @param {string} shiftId - The shift ID
 */
export const cancelShiftReminders = (shiftId) => {
  try {
    let canceledCount = 0;

    for (const [key, timeoutId] of activeReminders.entries()) {
      if (key.startsWith(shiftId)) {
        clearTimeout(timeoutId);
        activeReminders.delete(key);
        canceledCount++;
      }
    }

    console.log(`🗑️ Canceled ${canceledCount} reminders for shift ${shiftId}`);
    return canceledCount;
  } catch (error) {
    console.error('❌ Error canceling shift reminders:', error);
    return 0;
  }
};

/**
 * Get count of active reminders
 */
export const getActiveRemindersCount = () => {
  return activeReminders.size;
};

/**
 * Get active reminders for debugging
 */
export const getActiveReminders = () => {
  const reminders = [];
  for (const [key, timeoutId] of activeReminders.entries()) {
    reminders.push({
      key,
      hasTimeout: !!timeoutId
    });
  }
  return reminders;
};

/**
 * Clean up expired reminders (optional maintenance task)
 * This runs every hour to log active reminders count
 */
export const startMaintenanceTask = () => {
  cron.schedule('0 * * * *', () => {
    const activeCount = activeReminders.size;
    console.log(`🧹 Scheduler maintenance: ${activeCount} active reminders`);

    if (activeCount > 100) {
      console.log('⚠️ High number of active reminders detected');
    }
  });

  console.log('🔧 Scheduler maintenance task started (runs every hour)');
};

/**
 * Initialize the scheduler system
 */
export const initializeScheduler = () => {
  try {
    console.log('🚀 Initializing setTimeout-based scheduler system...');

    // Start maintenance task
    startMaintenanceTask();

    console.log('✅ Scheduler system initialized successfully');
    console.log('📝 Using setTimeout for reminders (no external dependencies)');
    console.log('🔧 Maintenance task running every hour');

    return true;
  } catch (error) {
    console.error('❌ Error initializing scheduler:', error);
    return false;
  }
};

export default {
  scheduleShiftReminders,
  cancelShiftReminders,
  getActiveRemindersCount,
  getActiveReminders,
  initializeScheduler
};
