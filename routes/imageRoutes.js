import express from 'express';
import { upload } from '../middlewares/uploadMiddleware.js';
import { uploadProductImages } from '../controllers/imageController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/:product_id', authMiddleware, upload.array('images', 4), uploadProductImages);

export default router;
