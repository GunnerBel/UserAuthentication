const express = require('express');
const { registerUser, loginUser, getUserProfile } = require('../controllers/user.controller');
const { protect, role } = require('../middleware/authentication');

const router = express.Router();

// Route for user registration
router.post('/register', registerUser);

// Route for user login
router.post('/login', loginUser);

// Route to get the logged-in user's profile, protected by authentication
router.get('/profile', protect, getUserProfile);

// Example route to get all users (admin only)
router.get('/admin/users', protect, role('admin'), async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

module.exports = router;
