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
    const products = await Product.find({});
    res.json(products)
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