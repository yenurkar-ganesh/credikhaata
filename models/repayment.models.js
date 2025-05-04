const mongoose = require("mongoose");
const moment = require("moment");

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

module.exports = mongoose.model("Repayment", repaymentSchema);
