import db from '../config/db.js';

export const placeBid = async (req, res) => {

    const { product_id } = req.params;
    const { amount } = req.body;
    const buyer_id = req.user.user_id;
  
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Bid amount must be greater than zero' });
    }
  
    try {

      const productResult = await db.query(
        `SELECT * FROM products WHERE product_id = $1`,
        [product_id]
      );
  
      if (productResult.rows.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      const product = productResult.rows[0];
  
      if (product.seller_id === buyer_id) {
        return res.status(400).json({ error: 'You cannot bid on your own product' });
      }
  
      const highestBidResult = await db.query(
        `SELECT amount, buyer_id
         FROM bids
         WHERE product_id = $1
         ORDER BY amount DESC
         LIMIT 1`,
        [product_id]
      );
  
      if (highestBidResult.rows.length > 0) {

        const highestBid = highestBidResult.rows[0];
  
        if (highestBid.buyer_id === buyer_id) {
          return res.status(400).json({ error: 'You are already the highest bidder' });
        }
  
        if (amount <= highestBid.amount) {
          return res.status(400).json({
            error: `Bid must be greater than current highest bid (${highestBid.amount})`,
          });
        }

      } 
      else {

        if (amount <= product.asking_price) {
          return res.status(400).json({
            error: `Bid must be greater than asking price (${product.asking_price})`,
          });
        }

      }
  
      const bidResult = await db.query(
        `INSERT INTO bids (amount, created_at, buyer_id, product_id)
         VALUES ($1, NOW(), $2, $3)
         RETURNING *`,
        [amount, buyer_id, product_id]
      );
  
      res.status(201).json({ message: 'Bid placed successfully', bid: bidResult.rows[0] });
  
    } 
    catch (err) {
      console.error('Error placing bid:', err);
      res.status(500).json({ error: 'Failed to place bid' });
    }
    
  };
  