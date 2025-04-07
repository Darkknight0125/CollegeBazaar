# CollegeBazaar Backend

This is the backend for **CollegeBazaar**, a college e-commerce platform built with **Node.js, Express, and PostgreSQL**.

## Features
- User Authentication with JWT
- Database: PostgreSQL hosted on Neon.tech
- Modular Structure: Routes, Controllers, Middleware, and Models
- RESTful API for seamless integration with the frontend

---

## Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL (Neon.tech)
- **Auth:** JWT-based authentication
- **Environment:** dotenv for configuration

---

## Project Structure
```
.
├── src
|   ├── config
│   ├── controllers
│   ├── middlewares
│   ├── models
│   ├── routes
|   ├── app.js
├── package.json
├── .env.example
├── README.md
└── API_DOCS.md
```

---

## Setup Instructions

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/collegebazaar-backend.git
   cd collegebazaar-backend
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Configure environment variables:
   - Create a `.env` file in the root directory
   - Add the following variables:
   ```
   PORT=5000
   JWT_SECRET=your_super_secure_secret
   DATABASE_URL=your_postgres_connection_url
   ```

4. Start the server:
   ```sh
   npm start
   ```

---

## API Documentation
For detailed API endpoints and usage, refer to the [API Documentation](API_DOCS.md).

---

