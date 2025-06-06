# Testing Shift Reminders - Metro de Sevilla

## Updated Testing Guide (June 5, 2025)

### Available Testing Options

#### 1. **Production Reminders** (Default)
- **Intervals**: 2 hours before, 1 day before
- **Usage**: Normal shift creation from frontend
- **API**: `POST /api/shifts` (without any test flags)

#### 2. **Quick Test Reminders** (For Frontend Testing)
- **Intervals**: 30 seconds, 1 minute
- **Usage**: For testing email functionality quickly
- **API**: `POST /api/shifts` with `{"quickTest": true}`

#### 3. **Extended Test Reminders** (For Manual Testing)
- **Intervals**: 30 seconds, 1 minute, 2 minutes
- **Usage**: For comprehensive testing via test endpoint
- **API**: `POST /api/shifts/test`

### How to Test from Frontend

#### Option A: Use the new Quick Test Function
```javascript
import { createShiftWithQuickTest } from './lib/shift.js';

// Create a shift with 30s and 1min reminders
const testShift = await createShiftWithQuickTest({
  start: "2025-06-05T15:00:00.000Z",
  end: "2025-06-05T23:00:00.000Z", 
  title: "TEST Turno de Mañana",
  type: "morning",
  employee: "employee_id_here"
});
```

#### Option B: Add quickTest parameter to normal function
```javascript
import { createShift } from './lib/shift.js';

const testShift = await createShift({
  start: "2025-06-05T15:00:00.000Z",
  end: "2025-06-05T23:00:00.000Z",
  title: "TEST Turno de Mañana", 
  type: "morning",
  employee: "employee_id_here",
  quickTest: true  // This enables 30s and 1min reminders
});
```

### API Endpoints

#### Create Quick Test Shift (Frontend)
```bash
POST /api/shifts
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

{
  "start": "2025-06-05T15:00:00.000Z",
  "end": "2025-06-05T23:00:00.000Z",
  "title": "TEST Turno de Mañana",
  "type": "morning", 
  "employee": "employee_id_here",
  "quickTest": true
}
```

#### Manual Test Endpoints
```bash
# Create extended test shift (30s, 1min, 2min)
POST /api/shifts/test

# Get scheduled jobs status  
GET /api/shifts/jobs

# Send immediate test email
POST /api/shifts/test-email
```

### Expected Console Logs

#### When creating with quickTest=true:
```
⚡ QUICK TEST MODE: Using quick test reminder intervals
⚡ QUICK TEST: Scheduling fast reminders for shift [ID]
⚡ Current time: [timestamp]
⚡ Shift start: [timestamp]
⚡ Scheduled QUICK 30-second reminder for shift [ID] at [time]
⚡ Scheduled QUICK 1-minute reminder for shift [ID] at [time]
```

#### When jobs execute:
```
🚀 Job started: remind-shift with data: { shiftId: '[ID]', reminderType: 'QUICK-TEST-30s' }
📧 Processing QUICK-TEST-30s shift reminder job for shift ID: [ID]
📧 Starting email send process...
📧 Attempting to send reminder email to: [email]
✅ Email sent successfully!
✅ Job completed: remind-shift
```

### Troubleshooting

#### If emails aren't sending:
1. Check RESEND_API_KEY in .env
2. Verify FROM_EMAIL is set to: `Metro Sevilla <onboarding@resend.dev>`
3. Check console for job execution logs
4. Test immediate email: `POST /api/shifts/test-email`

#### If jobs aren't scheduling:
1. Check Agenda initialization logs
2. Verify MongoDB connection
3. Check for TypeScript/syntax errors
4. Use `GET /api/shifts/jobs` to see scheduled jobs

### Fixed Issues
- ✅ Server startup blocking resolved
- ✅ Email FROM address fixed for Resend compatibility  
- ✅ Separate functions for different test scenarios
- ✅ Proper production vs test mode separation
- ✅ Added timeout to prevent Agenda blocking
- ✅ Enhanced debugging logs for all operations
