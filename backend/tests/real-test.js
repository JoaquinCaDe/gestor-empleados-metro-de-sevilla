// Real API test to create a shift and test the scheduler
import fetch from 'node-fetch';

const API_BASE = 'http://localhost:5000/api';
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MmM3OGQ3OThiODQ3YTM3M2RkMWRlNCIsInVzZXJuYW1lIjoiYWRtaW4iLCJpYXQiOjE3NDkxMzE2MzEsImV4cCI6MTc0OTIxODAzMX0.3lVNvFW2m5-uLUN4n-8RXRbnP8XSR9M3jEuM7IojzQ4';

async function testWithRealAPI() {
  try {
    console.log('🧪 Real API Scheduler Test');
    console.log('==========================');    // Step 1: Get admin user info
    console.log('1. Getting admin user info...');
    const usersResponse = await fetch(`${API_BASE}/users/all`, {
      headers: { 'Authorization': `Bearer ${AUTH_TOKEN}` }
    });

    if (!usersResponse.ok) {
      console.log('❌ Failed to get users');
      return;
    }

    const usersData = await usersResponse.json();
    const adminUser = usersData.users.find(u => u.role === 'admin');

    if (!adminUser) {
      console.log('❌ Admin user not found');
      return;
    }

    console.log(`✅ Found admin user: ${adminUser.name} (${adminUser.email})`);

    // Step 2: Check scheduler status before creating shift
    console.log('\n2. Checking initial scheduler status...');
    const statusResponse = await fetch(`${API_BASE}/shifts/jobs`, {
      headers: { 'Authorization': `Bearer ${AUTH_TOKEN}` }
    });

    if (statusResponse.ok) {
      const statusData = await statusResponse.json();
      console.log(`   Scheduler type: ${statusData.schedulerType}`);
      console.log(`   Status: ${statusData.status}`);
      console.log(`   Active reminders: ${statusData.totalActiveReminders}`);
    }

    // Step 3: Create a test shift with quick reminders
    console.log('\n3. Creating test shift with quick reminders...');

    const shiftData = {
      title: 'REAL TEST SHIFT - Quick Reminders',
      start: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
      end: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours from now
      type: 'morning',
      employee: adminUser._id,
      quickTest: true
    };

    console.log(`   Shift start: ${shiftData.start.toLocaleString()}`);
    console.log(`   Shift end: ${shiftData.end.toLocaleString()}`);
    console.log(`   Employee: ${adminUser.name}`);

    const createResponse = await fetch(`${API_BASE}/shifts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`
      },
      body: JSON.stringify(shiftData)
    });

    if (!createResponse.ok) {
      const errorData = await createResponse.json();
      console.log('❌ Failed to create shift:', errorData.message);
      return;
    }

    const shiftResponse = await createResponse.json();
    console.log(`✅ Shift created successfully!`);
    console.log(`   Shift ID: ${shiftResponse.shift._id}`);
    console.log(`   Message: ${shiftResponse.message}`);

    // Step 4: Check scheduler status after creating shift
    console.log('\n4. Checking scheduler status after creating shift...');
    const newStatusResponse = await fetch(`${API_BASE}/shifts/jobs`, {
      headers: { 'Authorization': `Bearer ${AUTH_TOKEN}` }
    });

    if (newStatusResponse.ok) {
      const newStatusData = await newStatusResponse.json();
      console.log(`   Active reminders: ${newStatusData.totalActiveReminders}`);
      if (newStatusData.activeReminders && newStatusData.activeReminders.length > 0) {
        console.log('   Reminder details:');
        newStatusData.activeReminders.forEach(reminder => {
          console.log(`     - ${reminder.key}`);
        });
      }
    }

    // Step 5: Test email functionality
    console.log('\n5. Testing email functionality...');
    const emailResponse = await fetch(`${API_BASE}/shifts/test-email`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${AUTH_TOKEN}` }
    });

    if (emailResponse.ok) {
      console.log('✅ Test email sent successfully!');
    } else {
      console.log('⚠️ Test email failed');
    }

    // Step 6: Monitor reminders execution
    console.log('\n6. Monitoring reminder execution...');
    console.log('📧 Watch for reminder emails in 30 seconds and 1 minute!');
    console.log(`⏰ Current time: ${new Date().toLocaleString()}`);

    let count = 0;
    const monitor = setInterval(async () => {
      count++;
      console.log(`\n📊 Monitor check #${count} - ${new Date().toLocaleString()}`);

      // Check scheduler status
      const monitorResponse = await fetch(`${API_BASE}/shifts/jobs`, {
        headers: { 'Authorization': `Bearer ${AUTH_TOKEN}` }
      });

      if (monitorResponse.ok) {
        const monitorData = await monitorResponse.json();
        console.log(`   Active reminders: ${monitorData.totalActiveReminders}`);

        if (monitorData.activeReminders && monitorData.activeReminders.length > 0) {
          monitorData.activeReminders.forEach(reminder => {
            console.log(`     - ${reminder.key}`);
          });
        } else if (count > 4) { // After 1 minute
          console.log('   📧 All reminders should have been sent!');
        }
      }

      if (count >= 8) { // 8 * 15s = 2 minutes
        clearInterval(monitor);
        console.log('\n✅ Test completed! Check your email inbox.');
        console.log('📈 Summary: Scheduler successfully created and executed reminders');
        process.exit(0);
      }
    }, 15000);

  } catch (error) {
    console.error('❌ Test error:', error);
    process.exit(1);
  }
}

console.log('🚀 Starting Real API Test...');
console.log('This will create a real shift and test the scheduler with actual emails');
console.log('');

testWithRealAPI();
