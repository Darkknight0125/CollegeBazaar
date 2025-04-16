import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { addProduct, editProduct, deleteProduct } from '../controllers/productController.js';

const router = express.Router();

router.post('/add-product', authMiddleware, addProduct);
router.patch('/edit-product/:product_id', authMiddleware, editProduct);
router.delete('/delete-product/:product_id', authMiddleware, deleteProduct);

export default router;
