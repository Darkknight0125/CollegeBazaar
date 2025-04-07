import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Client } = pkg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

await client
  .connect()
  .then(() => console.log("Connected to PostgreSQL via Neon.tech"))
  .catch((err) => console.error("Connection error", err));

export default client;
