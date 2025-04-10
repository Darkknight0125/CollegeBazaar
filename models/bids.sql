CREATE TABLE bids (
  bid_id SERIAL PRIMARY KEY,
  amount NUMERIC CHECK (amount > 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  buyer_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(product_id) ON DELETE CASCADE
);