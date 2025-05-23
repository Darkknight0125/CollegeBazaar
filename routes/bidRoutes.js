import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { placeBid, getAllBidsOnProduct, getHighestBidOnProduct, getMyBids } from '../controllers/bidController.js';

const router = express.Router();

router.post('/place-bid/:product_id', authMiddleware, placeBid);
router.get('/product/:product_id', getAllBidsOnProduct);
router.get('/product/:product_id/highest', getHighestBidOnProduct);
router.get('/self-bids', authMiddleware, getMyBids);

export default router;
