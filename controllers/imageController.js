import db from '../config/db.js';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';

export const uploadProductImages = async (req, res) => {

  const { product_id } = req.params;
  const seller_id = req.user.user_id;

  try {

    const product = await db.query(
      `SELECT * FROM products WHERE product_id = $1 AND seller_id = $2`,
      [product_id, seller_id]
    );

    if (product.rows.length === 0) {
      return res.status(403).json({ error: 'Unauthorized or product not found' });
    }

    const countResult = await db.query(
      `SELECT COUNT(*) FROM product_images WHERE product_id = $1`,
      [product_id]
    );
    const existingCount = parseInt(countResult.rows[0].count);

    if (existingCount + req.files.length > 4) {
      return res.status(400).json({ error: 'You can upload up to 4 images only' });
    }

    const uploadedUrls = [];

    for (const file of req.files) {
      const url = await uploadToCloudinary(file.buffer, `product_${product_id}_${Date.now()}`);
      await db.query(
        `INSERT INTO product_images (product_id, image_url) VALUES ($1, $2)`,
        [product_id, url]
      );
      uploadedUrls.push(url);
    }

    res.status(201).json({ message: 'Images uploaded', urls: uploadedUrls });

  } 
  catch (err) {
    console.error('Image upload error:', err);
    res.status(500).json({ error: 'Failed to upload images' });
  }
  
};
