import express from "express";
import { createProduct, getProducts, updateProduct, deleteProduct} from "../controllers/product.controller.js";
import { protect, role } from "../middleware/authentication.js";
import Product from "../models/product.model.js";

const router = express.Router()

router.post('/createproduct', protect, role('admin'), createProduct)
router.get('/products', getProducts)
router.put('/updateproduct/:id', protect, role('admin'), updateProduct)
router.delete('/deleteproduct/:id', protect, role('admin'), deleteProduct)

export default router