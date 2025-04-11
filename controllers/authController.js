import bcrypt from 'bcrypt';
import db from '../config/db.js';

export const signup = async (req, res) => {

  const { name, roll_no, phone_no, email, password, hostel } = req.body;

  if (!name || !roll_no || !phone_no || !email || !password || !hostel) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {

    const existing = await db.query(
      `SELECT * FROM users WHERE roll_no = $1 OR email = $2 OR phone_no = $3`,
      [roll_no, email, phone_no]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists with same roll_no, email or phone number' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      `INSERT INTO users (name, roll_no, phone_no, email, password, hostel)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [name, roll_no, phone_no, email, hashedPassword, hostel]
    );

    res.status(201).json({ message: 'User signed up successfully' });

  } 
  catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Server error during signup' });
  }
  
};
