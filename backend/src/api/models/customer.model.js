const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    creatorCompany: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    customerCompany: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Customer = mongoose.model("Customer", CustomerSchema);

module.exports = Customer;
