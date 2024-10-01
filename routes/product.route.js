import express from "express";
import { createProduct, getProducts, updateProduct, deleteProduct, searchProduct, likeProduct, addComment } from "../controllers/product.controller.js";
import { protect, role } from "../middleware/authentication.js";
import Product from "../models/product.model.js";

const router = express.Router()

router.post('/createproduct', protect, role('admin'), createProduct)
router.get('/products', getProducts)
router.put('/updateproduct/:id', protect, role('admin'), updateProduct)
router.delete('/deleteproduct/:id', protect, role('admin'), deleteProduct)
router.get('/search', searchProduct)
router.put('/like/:id', protect, likeProduct)
router.post('/comment/:id', protect, addComment)


export default router