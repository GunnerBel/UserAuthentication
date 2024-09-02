import User from '../models/user.model.js'
import jwt from 'jsonwebtoken'
import dotenv from  'dotenv'

dotenv.config()

// protect routes

export const protect = async (req, res, next) => {
    let token;
//checking for token in header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // Get user from the token
            req.user = await User.findById(decoded.id).select('-password');

            next();
        } catch (error) {
            console.log(error);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    }

    if (!token) {
        res.status(401).json({message: 'Not authorized, no token'})
    }
}

// restrict access to specific roles

export const role = (requiredRole) => {
    return (req, res, next) => 
    {
        if (req.user && req.user.role === requiredRole) 
            {
            next();
        }
        else 
        {
            res.status(403).json({message: 'Forbidden - Access denied'})
        }
    };
    }