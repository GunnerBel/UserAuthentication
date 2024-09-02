import User from '../models/user.model.js'
import jwt  from 'jsonwebtoken'
import dotenv from  'dotenv'

dotenv.config()

//generate a json web token

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '600s',
    })
}

//Register a new user

export const registerUser = async (req, res) => {
    const {name, email, password, role} = req.body;

    //check if user already exists
    const userExists = await User.findOne({email});

    if (userExists) {
        return res.status(400).json({message: 'User already exists'})
    }
   //create a new user if the user does not exist
    const user = await User.create({
        name,
        email,
        password,
        role
    });

    if(user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        })
    } else {
        res.status(400).json({message: 'Invalid user data'})
    }
}

// User Login and generate token

export const loginUser = async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});

    if(user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        })  
    } else {
        res.status(401).json({message: 'Invalid email or password'})
    }
}

//get user profile

export const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);
    if(user){
    res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    })
   }
   else {
    res.status(404).json({message: 'User not found'})
   }
}

//get all users

export const getUsers = async (req, res) => {
    const users = await User.find({});
    res.json(users)
}

//delete user

export const deleteUser = async (req, res) => {
    const user = await User.findById(req.params.id);
    if(user) {
        await user.remove();
        res.json({message: 'User removed'})
    } else {
        res.status(404).json({message: 'User not found'})
    }
}

//update user

export const updateUser = async (req, res) => {
    const user = await User.findById(req.params.id);
    if(req.params.id === req.user.id || req.user.role === 'admin') {
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        user.role = req.body.role || user.role
        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role
        })
    } else {
        res.status(404).json({message: 'User not found'})
    }
}