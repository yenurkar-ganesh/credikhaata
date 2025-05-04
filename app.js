// server.js or app.js
import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import connectDB from "./db/connect.js";
import User from "./models/user.models.js";
import jwt from "jsonwebtoken";
import authenticate from "./middlewares/authenticate.js";
import Customer from "./models/customer.models.js";
import Loan from "./models/loan.models.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//register user route
// /register
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.query;
    console.log("Received data:", { name, email, password });

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existedUser = await User.findOne({ email });
    if (existedUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await new User({ name, email, password: hashedPassword }).save();

    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Error registering user:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

//login user route
// /login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Received from client:", { email, password });

  try {
    const user = await User.findOne({ email }).select("+password");
    console.log("User found in DB:", user);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPassMatched = await bcrypt.compare(password, user.password);
    if (!isPassMatched) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // ✅ Include user._id in the token
    const token = jwt.sign(
      { _id: user._id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "2d" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error logging in user:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

//create a new customer
app.post("/new-customer", authenticate, async (req, res) => {
  const { name, phone, trustScore } = req.body;
  console.log("Received customer data:", { name, phone, trustScore });
  const userId = req.user._id; // ✅ Provided by middleware

  try {
    if (!name || !phone) {
      return res.status(400).json({ message: "Name and phone are required" });
    }

    const newCustomer = await Customer.create({
      name,
      phone,
      trustScore,
      userId,
    });

    res.status(201).json({
      message: "Customer created successfully",
      customer: newCustomer,
    });
  } catch (error) {
    console.error("Error creating customer:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

//get all customers
app.get("/customers", authenticate, async (req, res) => {
  const userId = req.user._id;
  console.log("User ID from token:", userId);
  try {
    console.log("Fetching customers for User ID:", userId);
    const customers = await Customer.find({ userId });
    if (customers.length === 0) {
      return res
        .status(404)
        .json({ message: "No customers found for this user." });
    }

    res.status(200).json({ customers });
    console.log("Customers fetched successfully:", customers);
  } catch (error) {
    console.error("Error fetching customers:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

//get a single customer of logged in user
app.get("/customers/:id", authenticate, async (req, res) => {
  const userId = req.user._id;
  const customerId = req.params.id;
  console.log("User ID from token:", userId);

  try {
    const customer = await Customer.findOne({ _id: customerId, userId });

    if (!customer) {
      return res
        .status(404)
        .json({ message: "Customer not found for this user" });
    }

    res.status(200).json({ customer });
    console.log("Customer fetched successfully:", customer);
  } catch (error) {
    console.error("Error fetching customer:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

//update a customer of logged in user

app.put("/customers/:id", authenticate, async (req, res) => {
  const userId = req.user._id;
  const customerId = req.params.id;
  const { name, phone, trustScore } = req.body;
  console.log("User ID from token:", userId);

  try {
    const customer = await Customer.findOneAndUpdate(
      { _id: customerId, userId },
      { name, phone, trustScore },
      { new: true }
    );

    if (!customer) {
      return res
        .status(404)
        .json({ message: "Customer not found for this user" });
    }

    res
      .status(200)
      .json({ message: "Customer updated successfully", customer });
    console.log("Customer updated successfully:", customer);
  } catch (error) {
    console.error("Error updating customer:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// delete a customer of logged in user
app.delete("/customers/:id", authenticate, async (req, res) => {
  const userId = req.user._id;
  const customerId = req.params.id;
  console.log("User ID from token:", userId);

  try {
    const customer = await Customer.findOneAndDelete({
      _id: customerId,
      userId,
    });

    if (!customer) {
      return res
        .status(404)
        .json({ message: "Customer not found for this user" });
    }

    res.status(200).json({ message: "Customer deleted successfully" });
    console.log("Customer deleted successfully:", customer);
  } catch (error) {
    console.error("Error deleting customer:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// 💳 Loan Management (Protected)
app.post("/new-loan", authenticate, async (req, res) => {
    const { customerId, amount, dueDate } = req.body;
    const userId = req.user._id; 
    console.log("Received loan data:", { customerId, amount, dueDate });

    


});

//db connection anf server start
const start = async () => {
  try {
    await connectDB();
    app.listen(process.env.PORT, () => {
      console.log(`Server running at http://localhost:${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to DB", error);
  }
};

start();
export default app;
