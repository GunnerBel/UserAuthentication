import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const connectDB = async () => {

    try
    {
        // Define the MongoDB connection string
        const conn =  await mongoose.connect(process.env.MONGO_URI)
        
        console.log(`Mongodb connected: ${conn.connection.host}`);
    }
    catch(error)
    {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }

}

export default connectDB
