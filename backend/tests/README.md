# Backend Tests

This directory contains all test files for the Metro de Sevilla shift management backend.

## Test Files

### 📊 **real-test.js**
- **Purpose**: Complete API integration test using real HTTP requests
- **Features**: Tests the entire scheduler workflow with actual database operations
- **Usage**: `node tests/real-test.js`
- **Requirements**: Backend server must be running on port 5000

### 🧪 **simple-test.js**
- **Purpose**: Direct database test without HTTP layer
- **Features**: Tests scheduler functions directly with mock data
- **Usage**: `node tests/simple-test.js`
- **Requirements**: MongoDB connection, scheduler functions

### 🔧 **test-scheduler.js**
- **Purpose**: Comprehensive scheduler test suite
- **Features**: Login, authentication, shift creation, reminder monitoring
- **Usage**: `node tests/test-scheduler.js`
- **Requirements**: Backend server running, valid admin credentials

## Quick Start

1. **Start the backend server**:
   ```bash
   npm start
   ```

2. **Run the complete API test**:
   ```bash
   node tests/real-test.js
   ```

3. **Test scheduler directly**:
   ```bash
   node tests/simple-test.js
   ```

## Test Results

All tests verify:
- ✅ Scheduler initialization
- ✅ Reminder scheduling (30s, 1min for quick tests)
- ✅ Email delivery via Resend
- ✅ Database operations
- ✅ API endpoints functionality

## Authentication

Tests use a pre-configured JWT token. If tests fail with authentication errors, update the `AUTH_TOKEN` in the test files with a fresh token from the login endpoint.

## Email Testing

Tests send emails to `admin@metrosevilla.com`. Check the email configured in your admin user for reminder delivery verification.
