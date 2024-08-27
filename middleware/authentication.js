const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// Middleware to protect routes and verify the JWT token
exports.protect = async (req, res, next) => {
  let token;
  try {
    // Check if the authorization header exists and starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]; // Extract the token
    }

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized, no token' });
    }

    // Verify the token and extract the payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user to the request object, excluding the password
    req.user = await User.findById(decoded.id).select('-password');

    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized, token failed' });
  }
};

// Middleware to restrict access to specific roles (e.g., admin)
exports.role = (requiredRole) => {
  return (req, res, next) => {
    if (req.user && req.user.role === requiredRole) {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden - Access denied' });
    }
  };
};
