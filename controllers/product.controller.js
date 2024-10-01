import Product from "../models/product.model.js";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export const createProduct = async (req, res) => {
    const {name, description, price, stock, createdAt} = req.body
    const product = new Product({
        name,
        description,
        price,
        stock,
        createdAt
        
    })
    await product.save()
    res.json(product)

}

export const getProducts = async (req, res) => {
    try
    { 
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 1;
        
        const skip = (page - 1) * limit;

        const products = await Product.find().skip(skip).limit(limit);
        const totalProducts = await Product.countDocuments();

        res.json({
            products,
            currentPage: page,
            totalPages: Math.ceil(totalProducts / limit),
            totalProducts
        })
    }
    catch
    {
        res.status(500).json({message: 'Internal server error'})
    }
}

export const updateProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product)
    {
    product.name = req.body.name
    product.description = req.body.description
    product.price = req.body.price
    product.stock = req.body.stock
    await product.save()
    res.json(product)
    }
    else {
        res.status(404).json({message: 'Product not found'})
    }
}

export const deleteProduct = async (req, res) => {

    const product = await Product.findById(req.params.id);
    if (product){
    await product.deleteOne();
    res.json({message: 'Product removed'})
    }
    else {
        res.status(404).json({message: 'Product not found'})
    }
}

export const searchProduct = async (req, res) => {
    try
    {
        const searchTerm = req.query.q;
        const products = await Product.find({

            $or: [
                { name: { $regex: searchTerm, $options: 'i' } },

                { description: { $regex: searchTerm, $options: 'i' }}   

            ]
            
        });

        if (products.length === 0) {
            res.json({ message: 'No products found' });
        } else {
            res.json(products);
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
}
}

export const likeProduct = async (req, res) => {
    try
    {
        const product = await Product.findById(req.params.id);
        if (product)
        {
        product.likes = product.likes + 1 //increment the likes
        await product.save();
        res.json(product)
        }
        else {
            res.status(404).json({message: 'Product not found'})
        }
    }
    catch
    {
        res.status(500).json({message: 'Internal server error'})
    }
}

export const addComment = async (req, res) => {

    try
    {
        const {comment} = req.body;
        const product = await Product.findById(req.params.id);

        if(!product) {
            res.status(404).json({message: 'Product not found'})
        }

        const newComment = {
            user: req.user.id,
            comment
        }

        product.comments.push(newComment);
        await product.save();
        res.json({message: 'comment added', comments: product.comments})

    }
    catch(error)
    {
        res.status(500).json({message: 'Internal server error'})
        console.log(error)
    }
}