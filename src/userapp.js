import express from 'express'
import dotenv from 'dotenv'
import connectDB from '../config/db.js'
import userRoutes from '../routes/user.route.js'
import productRoutes from '../routes/product.route.js'


dotenv.config()

connectDB();

const app = express();
app.use(express.json());

app.use('/api/users', userRoutes);

app.use('/product', productRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))   