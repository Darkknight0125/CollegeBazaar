import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { postQuery, getQueriesOnProduct, respondToQuery } from '../controllers/queryController.js';

const router = express.Router();

router.post('/post/:product_id', authMiddleware, postQuery);
router.get('/:product_id', getQueriesOnProduct);
router.post('/respond/:query_id', authMiddleware, respondToQuery);

export default router;
