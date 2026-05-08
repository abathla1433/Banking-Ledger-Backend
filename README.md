🏦 Banking Ledger System

A production-grade banking backend system built using Node.js, Express.js, and MongoDB.
This project demonstrates secure financial transaction handling, ledger-based accounting, and backend architecture suitable for real-world banking workflows.

📌 Project Overview

The Banking Ledger System is designed to manage users, bank accounts, and financial transactions with a strong focus on:

Data Integrity
Transaction Consistency
Security
Scalability

The system follows a ledger-based accounting architecture, ensuring that every transaction is permanently recorded and traceable, making the ledger the single source of truth for account balances.

🚀 Features
🔐 User Authentication
Secure user registration and login
Password hashing using bcrypt
JWT-based authentication
Protected routes using middleware
🏦 Account Management
Create and manage bank accounts
Account status handling:
Active
Frozen
Closed
Balance tracking
💸 Transaction Processing
Credit and debit operations
Atomic transaction handling
Transaction validation
Consistent balance updates
📒 Ledger System
Centralized ledger for all financial movements
Immutable transaction records
Accurate balance reconciliation
Full audit trail support
♻️ Idempotency Handling
Prevents duplicate transaction processing
Safe retry mechanism for APIs
Uses unique idempotency keys
📧 Notification System
Email notifications using Nodemailer
Registration confirmation emails
Transaction success alerts
🛡️ Security Features
JWT token blacklisting for secure logout
Environment variable management using dotenv
Authentication middleware
Protected API endpoints
🛠️ Tech Stack
Technology	Purpose
Node.js	Runtime Environment
Express.js	Backend Framework
MongoDB	Database
Mongoose	ODM
JWT	Authentication
bcrypt	Password Hashing
Nodemailer	Email Services
dotenv	Environment Configuration
📂 Project Structure
Banking-Ledger-System/
│
├── controllers/
├── models/
├── routes/
├── middlewares/
├── services/
├── utils/
├── config/
├── emails/
├── app.js
├── server.js
├── package.json
└── .env
⚙️ Getting Started
📋 Prerequisites

Make sure you have installed:

Node.js
MongoDB (Local or Atlas)
npm
🔧 Installation & Setup
1️⃣ Clone the Repository
git clone <your-github-repo-url>
cd Banking-Ledger-System
2️⃣ Install Dependencies
npm install
3️⃣ Configure Environment Variables

Create a .env file in the root directory.

PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

EMAIL_USER=your_email
EMAIL_PASS=your_email_password
4️⃣ Start the Server
Development Mode
npm run dev
Production Mode
npm start
🧪 API Testing

Use Postman or any API testing tool.

🔑 Authentication APIs
Register User
POST /api/auth/register
Login User
POST /api/auth/login

Returns a JWT authentication token.

💳 Transaction APIs
Transfer Money
POST /api/transaction/transfer
Required Headers
Authorization: Bearer <token>
Idempotency-Key: unique_key
💰 Account APIs
Get Account Balance
GET /api/account/balance
🔄 Transaction Flow
User Request
    ↓
Authentication Middleware
    ↓
Transaction Validation
    ↓
Ledger Entry Creation
    ↓
Balance Update
    ↓
Transaction Confirmation
    ↓
Email Notification
🛡️ Security Measures
Password hashing with bcrypt
JWT authentication
Protected routes
Token blacklisting
Environment variable protection
Idempotent transaction APIs
📈 Future Improvements
Role-based access control (RBAC)
Rate limiting
Redis caching
Docker containerization
CI/CD integration
Unit & integration testing
Microservices architecture
