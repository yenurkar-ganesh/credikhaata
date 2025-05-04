import mongoose from "mongoose";
import validator from "validator";

import moment from "moment";


const repaymentSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
    min: 1,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const loanSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1000,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    repayments: [repaymentSchema],
    status: {
      type: String,
      enum: ["pending", "paid", "overdue"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Update loan status based on dueDate and repayments
loanSchema.pre("save", function (next) {
  const totalRepaid = this.repayments.reduce((sum, r) => sum + r.amount, 0);
  if (totalRepaid >= this.amount) {
    this.status = "paid";
  } else if (moment().isAfter(this.dueDate)) {
    this.status = "overdue";
  } else {
    this.status = "pending";
  }
  next();
});

const Loan = mongoose.model("Loan", loanSchema);
export default Loan;

// const User = mongoose.model("User", userSchema);
// export default User;
