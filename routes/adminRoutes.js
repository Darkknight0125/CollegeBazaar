import express from 'express';
import jwt from 'jsonwebtoken';
import { adminLogin, approveProduct, getApprovalPendingProducts } from '../controllers/adminController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/login', adminLogin);
router.patch('/products/approve', authMiddleware, approveProduct);
router.get('/products/approval-pending', authMiddleware, getApprovalPendingProducts);

export default router;