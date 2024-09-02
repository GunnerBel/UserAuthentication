import express from 'express'
import { registerUser, loginUser, getUserProfile, getUsers, deleteUser, updateUser } from '../controllers/user.controller.js'
import {protect, role} from '../middleware/authentication.js'
import User from '../models/user.model.js'

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/user-profile/:id', protect, async (req, res) => {
  if (req.params.id === req.user.id || req.user.role === 'admin') {
    // If the user is accessing their own profile or is an admin, return the profile data
    const user = await User.findById(req.params.id).select('-password');
    res.json(user);

  } 
  else {
    // If the user is not accessing their own profile and is not an admin, return a forbidden response
    res.status(403).json({ message: 'Forbidden' });
  }
});
router.get('/admin/users', protect, role('admin'), async (req, res) => {
    // Only the admin can access all users
    const users = await User.find({}).select('-password');
    res.json(users)
})

router.delete('/user/:id', protect, role('admin'), async (req, res) => {
    // Only the admin can delete users
    const user = await User.findById(req.params.id);
    if (user) {
        await user.deleteOne();
        res.json({message: 'User removed'})
    } else {
        res.status(404).json({message: 'User not found'})
    }
})

router.put('/user/:id', protect, updateUser)

export default router;