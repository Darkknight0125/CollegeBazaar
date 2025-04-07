import db from "../config/db.config.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Signup function
export const signupUser = async (req, res) => {

  try {

    const { name, roll_no, email, password, gender, phone_no } = req.body;

    const existingUser = await db.query(
      "SELECT * FROM users WHERE roll_no = $1 OR email = $2 OR phone_no = $3",
      [roll_no, email, phone_no]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.query(
      "INSERT INTO users (roll_no, name, email, password, gender, phone_no) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [roll_no, name, email, hashedPassword, gender, phone_no]
    );

    res.status(201).json({ message: "User registered successfully", user: result.rows[0] });

  } 
  catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }

};

// Login function
export const loginUser = async (req, res) => {

    try {

      const { identifier, password } = req.body;
  
      const userQuery = await db.query(
        "SELECT * FROM users WHERE roll_no = $1 OR email = $1 OR phone_no = $1",
        [identifier]
      );
  
      if (userQuery.rows.length === 0) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      const user = userQuery.rows[0];
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
      }
  
      const token = jwt.sign(
        { roll_no: user.roll_no },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
  
      res.status(200).json({ message: "Login successful", token });

    } 
    catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }

  };
