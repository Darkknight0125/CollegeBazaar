CREATE TABLE products (
  product_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  asking_price NUMERIC CHECK (asking_price > 0),
  deadline TIMESTAMPTZ CHECK (deadline > NOW()),
  seller_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE
);
