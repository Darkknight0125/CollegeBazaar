# CollegeBazaar Backend - API Documentation

This document provides API endpoints, request structures, and responses for the CollegeBazaar backend.

---

## User Routes

### 1. User Signup
**Endpoint:** `/api/users/signup`  
**Method:** `POST`  
**Description:** Registers a new user.

#### Request Body (JSON)
```json
{
  "name": "John Doe",
  "roll_no": "IIT2021001",
  "email": "john@example.com",
  "password": "securepassword",
  "gender": "Male",
  "phone_no": "9876543210"
}
```

#### Response (Success)
```json
{
  "message": "User registered successfully",
  "user": {
    "roll_no": "IIT2021001",
    "name": "John Doe",
    "email": "john@example.com",
    "gender": "Male",
    "phone_no": "9876543210"
  }
}
```

#### Response (Error)
- `400`: User already exists
- `500`: Server error

---

### 2. User Login
**Endpoint:** `/api/users/login`  
**Method:** `POST`  
**Description:** Authenticates a user and returns a JWT token.

#### Request Body (JSON)
```json
{
  "identifier": "IIT2021001",
  "password": "securepassword"
}
```
_(You can use **roll_no**, **email**, or **phone_no** as `identifier`)_

#### Response (Success)
```json
{
  "message": "Login successful",
  "token": "your_jwt_token"
}
```

#### Response (Error)
- `401`: Invalid credentials
- `500`: Server error

---
