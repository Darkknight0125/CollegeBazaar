import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { addProduct, editProduct, deleteProduct, getProductsByCategory } from '../controllers/productController.js';

const router = express.Router();

router.post('/add-product', authMiddleware, addProduct);
router.patch('/edit-product/:product_id', authMiddleware, editProduct);
router.delete('/delete-product/:product_id', authMiddleware, deleteProduct);
router.get('/get-products-by-category/:category', getProductsByCategory);

export default router;
