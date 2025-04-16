import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import authMiddleware from './middlewares/authMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/profile', authMiddleware, (req, res) => {
  // req.user is now available
  res.json({ message: 'Authenticated user', user: req.username, user_id: req.user_id });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
