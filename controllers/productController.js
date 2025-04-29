import db from '../config/db.js';

export const addProduct = async (req, res) => {

    const { name, description, asking_price, deadline, category } = req.body;
    const seller_id = req.user.user_id;

    if (!name || !asking_price || !deadline || !category) {
        return res.status(400).json({ error: 'Name, asking_price, deadline and category are required' });
    }

    try {

        const result = await db.query(
        `INSERT INTO products (name, description, asking_price, deadline, seller_id, category)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
        [name, description || '', asking_price, deadline, seller_id, category]
        );

        res.status(201).json({ message: 'Product added', product: result.rows[0] });

    } 
    catch (err) {
        console.error('Error adding product:', err);
        res.status(500).json({ error: 'Failed to add product' });
    }

};

export const editProduct = async (req, res) => {

    const { product_id } = req.params;
    const { name, description, asking_price, deadline, category} = req.body;
    const seller_id = req.user.user_id;
  
    try {

      const existing = await db.query(
        `SELECT * FROM products WHERE product_id = $1 AND seller_id = $2`,
        [product_id, seller_id]
      );
  
      if (existing.rows.length === 0) {
        return res.status(403).json({ error: 'Unauthorized or product not found' });
      }
  
      const fields = [];
      const values = [];
      let index = 1;
  
      if (name !== undefined) {
        fields.push(`name = $${index++}`);
        values.push(name);
      }
  
      if (description !== undefined) {
        fields.push(`description = $${index++}`);
        values.push(description);
      }
  
      if (asking_price !== undefined) {
        fields.push(`asking_price = $${index++}`);
        values.push(asking_price);
      }
  
      if (deadline !== undefined) {
        fields.push(`deadline = $${index++}`);
        values.push(deadline);
      }

      if (category !== undefined) {
        fields.push(`category = $${index++}`);
        values.push(category);
      }
  
      if (fields.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
      }
  
      values.push(product_id);
  
      const query = `
        UPDATE products
        SET ${fields.join(', ')}
        WHERE product_id = $${index}
        RETURNING *;
      `;
  
      const result = await db.query(query, values);
  
      res.status(200).json({ message: 'Product updated', product: result.rows[0] });
  
    } 
    catch (err) {
      console.error('Error editing product:', err);
      res.status(500).json({ error: 'Failed to edit product' });
    }

};
  
  
export const deleteProduct = async (req, res) => {

    const { product_id } = req.params;
    const seller_id = req.user.user_id;

    try {

        const existing = await db.query(
        `SELECT * FROM products WHERE product_id = $1 AND seller_id = $2`,
        [product_id, seller_id]
        );

        if (existing.rows.length === 0) {
        return res.status(403).json({ error: 'Unauthorized or product not found' });
        }

        await db.query(`DELETE FROM products WHERE product_id = $1`, [product_id]);

        res.status(200).json({ message: 'Product deleted successfully' });

    } 
    catch (err) {
        console.error('Error deleting product:', err);
        res.status(500).json({ error: 'Failed to delete product' });
    }

};

export const getProductsByCategory = async (req, res) => {

  const category = req.params.category;

  if (!category) {
    return res.status(400).json({ error: 'Category is required' });
  }

  try {

    const result = await db.query(
      `SELECT * FROM products WHERE category = $1`,
      [category]
    );

    res.status(200).json({
      message: 'Products retrieved successfully',
      products: result.rows,
    });

  } 
  catch (err) {
    console.error('Error fetching products by category:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }

};

export const getActiveProducts = async (req, res) => {

  try {

    const result = await db.query(
      `SELECT * FROM products WHERE deadline > NOW()`
    );

    res.status(200).json({
      message: 'Active products retrieved successfully',
      products: result.rows,
    });

  } 
  catch (err) {
    console.error('Error fetching active products:', err);
    res.status(500).json({ error: 'Failed to fetch active products' });
  }
  
};