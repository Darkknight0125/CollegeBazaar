import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { addProduct } from '../controllers/productController.js';

const router = express.Router();

router.post('/add-product', authMiddleware, addProduct);

export default router;
