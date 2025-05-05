# credikhaata
“CrediKhaata – Loan Tracker for Shopkeepers”

# 🏦 Loan Management API
A RESTful API built with Node.js, Express, and MongoDB that allows users to:

Register and login

Manage customers and their details

Track loans and repayments securely

# 🚀 Features
User Registration & Authentication (JWT)

CRUD operations for Customers

CRUD operations for Loans

Repayment tracking for loans

Protected routes using middleware

MongoDB integration using Mongoose

# 🧱 Project Structure
📁 models/
│   ├── user.models.js
│   ├── customer.models.js
│   └── loan.models.js

📁 middlewares/
│   └── authenticate.js

📁 db/
│   └── connect.js

📄  app.js
📄 .env
📄 package.json
📄 README.md


#  🛠️ Setup Instructions
1. Clone the repository
bash
Copy
Edit
git clone <your-repo-url>
cd <project-folder>
2. Install dependencies
bash
Copy
Edit

npm install

4. Create a .env file
env
Copy
Edit

DATABASE_URL=your_mongodb_connection_string

JWT_SECRET=your_secret_key

PORT=5000

5. Start the server
bash
Copy
Edit
npm start
# or
nodemon server.js

#  📦 Dependencies
express

dotenv

mongoose

bcryptjs

jsonwebtoken

# 📡 API Endpoints
# 🔐 Authentication
POST /register
Register a new user.
Params (query): name, email, password

POST /login
Login and receive a JWT token.
Body: { email, password }

# 👤 Customers
All routes below require a valid JWT token in the Authorization header as Bearer <token>

POST /new-customer
Create a new customer.
Body: { name, phone, trustScore }

GET /customers
Get all customers of the logged-in user.

GET /customers/:id
Get a specific customer by ID.

PUT /customers/:id
Update customer details.
Body: { name, phone, trustScore }

DELETE /customers/:id
Delete a customer by ID.

# 💰 Loans
POST /new-loan
Create a new loan for a customer.
Body: { customerId, amount, dueDate }

GET /loans
Get all loans of the logged-in user.

GET /loans/:customerId
Get all loans of a specific customer.

POST /loans/:id/repayment
Add a repayment to a loan.
Body: { amount }

# 📋 Notes
All sensitive routes are protected by JWT middleware.

Use tools like Postman or Insomnia for testing endpoints.

Ensure MongoDB is running before starting the server.


