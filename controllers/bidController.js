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

export const getAllBidsOnProduct = async (req, res) => {

    const { product_id } = req.params;
  
    try {

      const result = await db.query(
        `SELECT b.*, u.name AS bidder_name, u.user_id, u.roll_no
         FROM bids b
         JOIN users u ON b.buyer_id = u.user_id
         WHERE b.product_id = $1
         ORDER BY b.amount DESC`,
        [product_id]
      );
  
      res.status(200).json({ bids: result.rows });
  
    } 
    catch (err) {
      console.error('Error fetching bids:', err);
      res.status(500).json({ error: 'Failed to fetch bids' });
    }

};
  
export const getHighestBidOnProduct = async (req, res) => {

    const { product_id } = req.params;
  
    try {

      const result = await db.query(
        `SELECT b.*, u.name AS bidder_name, u.user_id, u.roll_no
         FROM bids b
         JOIN users u ON b.buyer_id = u.user_id
         WHERE b.product_id = $1
         ORDER BY b.amount DESC
         LIMIT 1`,
        [product_id]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'No bids on this product yet' });
      }
  
      res.status(200).json({ highest_bid: result.rows[0] });
  
    } 
    catch (err) {
      console.error('Error fetching highest bid:', err);
      res.status(500).json({ error: 'Failed to fetch highest bid' });
    }

};

export const getMyBids = async (req, res) => {

    const user_id = req.user.user_id;
  
    try {

      const result = await db.query(
        `SELECT b.*, 
                p.name AS product_name, 
                p.asking_price, 
                p.deadline
         FROM bids b
         JOIN products p ON b.product_id = p.product_id
         WHERE b.buyer_id = $1
         ORDER BY b.created_at DESC`,
        [user_id]
      );
  
      res.status(200).json({ my_bids: result.rows });
  
    } 
    catch (err) {
      console.error('Error fetching user bids:', err);
      res.status(500).json({ error: 'Failed to fetch your bids' });
    }
    
};
  
  
  