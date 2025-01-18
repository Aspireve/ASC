const mongoose = require("mongoose");

const AgreementSchema = new mongoose.Schema({
  agreementId: {
    type: mongoose.Schema.Types.ObjectId, // Unique identifier for the agreement
    default: () => new mongoose.Types.ObjectId(),
    immutable: true,
  },
  title: {
    type: String, // Title of the agreement
    required: true,
  },
  description: {
    type: String, // Optional description of the agreement
  },
  parties: [
    {
      partyId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to a Company or User schema
        refPath: "parties.partyType",
        required: true,
      },
      partyType: {
        type: String,
        enum: ["Company", "User"], // Can refer to either Company or User schema
        required: true,
      },
    },
  ],
  content: {
    type: String, // The full text/content of the agreement
    required: true,
  },
  revisions: [
    {
      revisionNumber: {
        type: Number, // Revision version (e.g., 1, 2, 3...)
        required: true,
      },
      revisedBy: {
        type: mongoose.Schema.Types.ObjectId, // Who revised the agreement
        ref: "User",
      },
      revisedAt: {
        type: Date, // When the revision was made
        default: Date.now,
      },
      changes: {
        type: String, // Description or summary of changes made
      },
    },
  ],
  status: {
    type: String,
    enum: ["draft", "active", "expired", "terminated", "under_review"], // Status options
    default: "draft",
  },
  effectiveDate: {
    type: Date, // When the agreement becomes effective
    required: true,
  },
  expiryDate: {
    type: Date, // When the agreement expires
  },
  isAutoRenewable: {
    type: Boolean, // Whether the agreement automatically renews
    default: false,
  },
  renewalPeriod: {
    type: String, // Renewal period (e.g., "1 year", "6 months")
    required: function () {
      return this.isAutoRenewable;
    },
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId, // Who created the agreement
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

AgreementSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Agreement = mongoose.model("Agreement", AgreementSchema);

module.exports = Agreement;
