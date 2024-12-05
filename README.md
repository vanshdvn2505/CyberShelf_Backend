# CyberShelf Backend

This is the backend repository for **CyberShelf**, an application designed to provide students with seamless access to college resources such as previous year question papers (PYQs), important links, books, and more. Built with TypeScript and MongoDB, this backend ensures secure and efficient handling of data with robust authentication mechanisms.

---

## Features

### 1. **Authentication**
- **JWT-Based Authentication**: Secure login sessions using JSON Web Tokens.
- **OTP Verification**: Verifies user identity via email using **Nodemailer**.
- **Middleware**: Verifies user identity via token generated.

### 2. **Resource Management**
- Provides endpoints to:
  - Upload and manage college resources (PYQs, books, etc.).
  - Add, update, and delete important links.

### 3. **Database Integration**
- **MongoDB**: NoSQL database for efficient and scalable data storage.

### 4. **Email Integration**
- **Nodemailer**: Sends OTPs for email-based authentication.

### 5. **RESTful API Design**
- Intuitive endpoints for seamless integration with the frontend.

### 6. **TypeScript**
- Type-safe code ensures better developer experience and fewer runtime errors.

---

## Installation and Setup

Follow these steps to set up the backend locally:

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (local or cloud instance)
- **Git** (to clone the repository)

### Setup:
- clone the repository
- npm i
- npm run build
- npm run dev
