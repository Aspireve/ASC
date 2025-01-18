const mongoose = require("mongoose");

const LawyerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
    },
    licenseNumber: {
      type: String,
      unique: true,
    },
    company: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
      },
    ],
    agreements: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Agreement",
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Lawyer = mongoose.model("Lawyer", LawyerSchema);

module.exports = Lawyer;
