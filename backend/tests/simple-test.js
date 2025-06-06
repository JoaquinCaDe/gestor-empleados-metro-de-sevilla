// Simple test to create a shift with quick reminders through frontend helper
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import User from './src/models/user.model.js';
import { scheduleShiftReminders } from './src/jobs/scheduler.js';

async function runSimpleTest() {
  try {
    console.log('🧪 Simple Scheduler Test');
    console.log('========================');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find admin user
    const adminUser = await User.findOne({ username: 'admin' });
    if (!adminUser) {
      console.log('❌ Admin user not found');
      process.exit(1);
    }
    console.log(`✅ Found admin user: ${adminUser.name} (${adminUser.email})`);

    // Create a mock shift object for testing
    const mockShift = {
      _id: new mongoose.Types.ObjectId(),
      title: 'TEST SHIFT - Quick Reminders',
      start: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
      end: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours from now
      type: 'morning',
      employee: adminUser._id
    };

    console.log('\n📅 Test Shift Details:');
    console.log(`   Title: ${mockShift.title}`);
    console.log(`   Start: ${mockShift.start.toLocaleString()}`);
    console.log(`   End: ${mockShift.end.toLocaleString()}`);
    console.log(`   Employee: ${adminUser.name}`);

    // Schedule quick test reminders (30s and 1min)
    console.log('\n⚡ Scheduling quick test reminders...');
    const isQuickTest = true;
    const scheduled = scheduleShiftReminders(mockShift, isQuickTest);

    if (scheduled) {
      console.log('✅ Reminders scheduled successfully!');
      console.log('📧 You should receive emails in 30 seconds and 1 minute');
      console.log('⏰ Current time:', new Date().toLocaleString());

      // Monitor for 2 minutes
      console.log('\n🔍 Monitoring for reminder execution...');
      let count = 0;
      const monitor = setInterval(() => {
        count++;
        console.log(`📊 Monitor check #${count} - ${new Date().toLocaleString()}`);

        if (count >= 8) { // 8 * 15s = 2 minutes
          clearInterval(monitor);
          console.log('\n✅ Test completed! Check your email and server logs.');
          process.exit(0);
        }
      }, 15000);

    } else {
      console.log('❌ Failed to schedule reminders');
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Test error:', error);
    process.exit(1);
  }
}

runSimpleTest();
