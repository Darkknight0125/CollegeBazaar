import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import sellerRoutes from './routes/sellerRoutes.js';
import bidRoutes from './routes/bidRoutes.js';
import queryRoutes from './routes/queryRoutes.js';
import imageRoutes from './routes/imageRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/bid', bidRoutes);
app.use('/api/query', queryRoutes);
app.use('/api/images', imageRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
