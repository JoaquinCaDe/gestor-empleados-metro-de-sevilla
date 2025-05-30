const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'metro-sevilla-jwt-secret';
const JWT_EXPIRES_IN = '24h';

// Generate token for a user
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      username: user.username
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// Verify token middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN format

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Verify token for specific user or admin
const authenticateUser = (req, res, next) => {
  const userId = req.params.id || req.user.id;

  if (req.user.id === userId) {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied. Not authorized for this operation.' });
  }
};

module.exports = {
  generateToken,
  authenticateToken,
  authenticateUser
};
