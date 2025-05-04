import mongoose from "mongoose";
import validator from "validator";

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      validate: {
        validator: (v) => /^\d{10}$/.test(v), // 10-digit number
        message: "Invalid phone number",
      },
    },
    trustScore: {
      type: Number,
      min: 1,
      max: 10,
      default: 5,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true } 
);

const Customer = mongoose.model("Customer", customerSchema);
export default Customer;
