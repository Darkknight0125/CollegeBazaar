import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { placeBid } from '../controllers/bidController.js';

const router = express.Router();

router.post('/place-bid/:product_id', authMiddleware, placeBid);

export default router;
