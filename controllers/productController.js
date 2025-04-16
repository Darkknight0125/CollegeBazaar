import db from '../config/db.js';

export const addProduct = async (req, res) => {

  const { name, description, asking_price, deadline } = req.body;
  const seller_id = req.user.user_id;

  if (!name || !asking_price || !deadline) {
    return res.status(400).json({ error: 'Name, asking_price, and deadline are required' });
  }

  try {

    const result = await db.query(
      `INSERT INTO products (name, description, asking_price, deadline, seller_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, description || '', asking_price, deadline, seller_id]
    );

    res.status(201).json({ message: 'Product added', product: result.rows[0] });

  } 
  catch (err) {
    console.error('Error adding product:', err);
    res.status(500).json({ error: 'Failed to add product' });
  }
  
};
