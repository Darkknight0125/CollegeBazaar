import db from '../config/db.js';

export const postQuery = async (req, res) => {

    const { product_id } = req.params;
    const { query } = req.body;
    const customer_id = req.user.user_id;

    if (!query || query.trim() === '') {
        return res.status(400).json({ error: 'Query text is required' });
    }

    try {

        const productResult = await db.query(
        `SELECT seller_id FROM products WHERE product_id = $1`,
        [product_id]
        );

        if (productResult.rows.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
        }

        const seller_id = productResult.rows[0].seller_id;

        if (seller_id === customer_id) {
        return res.status(400).json({ error: 'You cannot post a query on your own product' });
        }

        const queryResult = await db.query(
            `INSERT INTO queries (product_id, customer_id, query, created_at)
            VALUES ($1, $2, $3, NOW())
            RETURNING *`,
            [product_id, customer_id, query]
        );

        res.status(201).json({ message: 'Query posted', query: queryResult.rows[0] });

    } 
    catch (err) {
        console.error('Error posting query:', err);
        res.status(500).json({ error: 'Failed to post query' });
    }

};

export const getQueriesOnProduct = async (req, res) => {

    const { product_id } = req.params;
  
    try {

      const result = await db.query(
        `SELECT q.*, u.name AS customer_name, u.roll_no
         FROM queries q
         JOIN users u ON q.customer_id = u.user_id
         WHERE q.product_id = $1
         ORDER BY q.created_at ASC`,
        [product_id]
      );
  
      res.status(200).json({ queries: result.rows });
  
    } 
    catch (err) {
      console.error('Error fetching queries:', err);
      res.status(500).json({ error: 'Failed to fetch queries' });
    }

  };

  export const respondToQuery = async (req, res) => {

    const { query_id } = req.params;
    const { reply } = req.body;
    const seller_id = req.user.user_id;
  
    if (!reply || reply.trim() === '') {
      return res.status(400).json({ error: 'Reply text is required' });
    }
  
    try {

      const queryResult = await db.query(
        `SELECT q.*, p.seller_id
         FROM queries q
         JOIN products p ON q.product_id = p.product_id
         WHERE q.query_id = $1`,
        [query_id]
      );
  
      if (queryResult.rows.length === 0) {
        return res.status(404).json({ error: 'Query not found' });
      }
  
      const query = queryResult.rows[0];
  
      if (query.seller_id !== seller_id) {
        return res.status(403).json({ error: 'You are not authorized to reply to this query' });
      }
  
      const updateResult = await db.query(
        `UPDATE queries
         SET reply = $1
         WHERE query_id = $2
         RETURNING *`,
        [reply, query_id]
      );
  
      res.status(200).json({ message: 'Reply added', query: updateResult.rows[0] });
  
    } 
    catch (err) {
      console.error('Error replying to query:', err);
      res.status(500).json({ error: 'Failed to reply to query' });
    }
    
  };
  
  
