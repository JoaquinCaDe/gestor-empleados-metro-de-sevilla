const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const userRoutes = require('./routes/user.route');
const shiftRoutes = require('./routes/shift.route');
const User = require('./models/user.model');

// Express app initialization
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS handling
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// API routes
app.use('/api/users', userRoutes);
app.use('/api/shifts', shiftRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Metro de Sevilla Shift Management API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Create initial admin user if no users exist
const createInitialAdminUser = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0 && process.env.ADMIN_USERNAME) {
      const adminUser = new User({
        username: process.env.ADMIN_USERNAME,
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        name: process.env.ADMIN_NAME,
        role: 'admin'
      });

      await adminUser.save();
      console.log('Initial admin user created');
    }
  } catch (error) {
    console.error('Error creating initial admin user:', error);
  }
};

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    createInitialAdminUser();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });

module.exports = app;