// Test script to verify the new scheduler works
import fetch from 'node-fetch';

const API_BASE = 'http://localhost:5000/api';

// Test credentials
const TEST_USER = {
  username: 'admin',
  password: 'test1234'
};

// Login function
async function login() {
  try {
    const response = await fetch(`${API_BASE}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(TEST_USER)
    });

    const data = await response.json();
    if (data.token) {
      console.log('✅ Login successful');
      return data.token;
    } else {
      console.log('❌ Login failed:', data.message);
      return null;
    }
  } catch (error) {
    console.log('❌ Login error:', error.message);
    return null;
  }
}

// Create test shift with quick reminders
async function createTestShift(token) {
  try {
    // Get admin user first
    const usersResponse = await fetch(`${API_BASE}/users`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const usersData = await usersResponse.json();
    const adminUser = usersData.users.find(u => u.role === 'admin');

    if (!adminUser) {
      console.log('❌ Admin user not found');
      return null;
    }

    const shiftData = {
      title: 'Test Shift - Quick Reminders',
      start: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
      end: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours from now
      type: 'morning',
      employee: adminUser._id,
      quickTest: true
    };

    const response = await fetch(`${API_BASE}/shifts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(shiftData)
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Test shift created successfully!');
      console.log(`📋 Shift ID: ${data.shift._id}`);
      console.log(`📅 Shift start: ${new Date(data.shift.start).toLocaleString()}`);
      console.log('⚡ Quick test reminders scheduled (30s and 1min from now)');
      return data.shift;
    } else {
      console.log('❌ Failed to create test shift:', data.message);
      return null;
    }
  } catch (error) {
    console.log('❌ Error creating test shift:', error.message);
    return null;
  }
}

// Check scheduler status
async function checkSchedulerStatus(token) {
  try {
    const response = await fetch(`${API_BASE}/shifts/jobs`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = await response.json();

    if (response.ok) {
      console.log('\n📊 Scheduler Status:');
      console.log(`   Type: ${data.schedulerType}`);
      console.log(`   Status: ${data.status}`);
      console.log(`   Active reminders: ${data.totalActiveReminders}`);

      if (data.activeReminders && data.activeReminders.length > 0) {
        console.log('   Reminder details:');
        data.activeReminders.forEach(reminder => {
          console.log(`     - ${reminder.key}`);
        });
      }

      return data;
    } else {
      console.log('❌ Failed to get scheduler status:', data.message);
      return null;
    }
  } catch (error) {
    console.log('❌ Error checking scheduler status:', error.message);
    return null;
  }
}

// Test email functionality
async function testEmail(token) {
  try {
    const response = await fetch(`${API_BASE}/shifts/test-email`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Test email sent successfully!');
      return true;
    } else {
      console.log('❌ Failed to send test email:', data.message);
      return false;
    }
  } catch (error) {
    console.log('❌ Error sending test email:', error.message);
    return false;
  }
}

// Main test function
async function runTests() {
  console.log('🧪 Starting Scheduler Test Suite');
  console.log('==================================\n');

  // Step 1: Login
  console.log('1. Logging in...');
  const token = await login();
  if (!token) {
    console.log('Cannot continue without authentication');
    process.exit(1);
  }

  // Step 2: Check initial scheduler status
  console.log('\n2. Checking scheduler status...');
  await checkSchedulerStatus(token);

  // Step 3: Test email functionality
  console.log('\n3. Testing email functionality...');
  await testEmail(token);

  // Step 4: Create test shift with quick reminders
  console.log('\n4. Creating test shift with quick reminders...');
  const shift = await createTestShift(token);

  if (!shift) {
    console.log('Test failed - could not create shift');
    process.exit(1);
  }

  // Step 5: Check scheduler status after creating shift
  console.log('\n5. Checking scheduler status after creating shift...');
  await checkSchedulerStatus(token);

  // Step 6: Monitor for reminders
  console.log('\n6. Monitoring for reminder execution...');
  console.log('📧 Watch the server console for reminder emails in 30s and 1min!');
  console.log('⏰ Current time:', new Date().toLocaleString());

  // Monitor status every 15 seconds for 2 minutes
  let monitorCount = 0;
  const monitorInterval = setInterval(async () => {
    monitorCount++;
    console.log(`\n📊 Status check #${monitorCount} (${new Date().toLocaleString()}):`);
    await checkSchedulerStatus(token);

    if (monitorCount >= 8) { // 8 * 15s = 2 minutes
      clearInterval(monitorInterval);
      console.log('\n✅ Test completed! Check server logs for reminder execution.');
      process.exit(0);
    }
  }, 15000);
}

console.log('🧪 New Scheduler Test Suite');
console.log('============================');
console.log('This will test the setTimeout-based scheduler system:');
console.log('1. Login with admin credentials');
console.log('2. Check scheduler status');
console.log('3. Test email functionality');
console.log('4. Create a test shift with 30s and 1min reminders');
console.log('5. Monitor reminder execution');
console.log('');

// Start tests automatically
runTests();
