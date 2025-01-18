const mongoose = require("mongoose");

const AgreementSchema = new mongoose.Schema(
  {
    agreementId: {
      type: mongoose.Schema.Types.ObjectId, // Unique identifier for the agreement
      default: () => new mongoose.Types.ObjectId(),
      immutable: true,
    },
    title: {
      type: String,
    },
    customer: [
      {
        type: mongoose.Schema.Types.ObjectId, // Reference to a Company or User schema
        ref: "Customer",
      },
    ],
    content: {
      type: String,
    },
    revisions: [
      {
        revisionNumber: {
          type: Number,
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
    },
    effectiveDate: {
      type: Date,
    },
    expiryDate: {
      type: Date,
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
    lawyer: {
      type: mongoose.Schema.Types.ObjectId, // Who created the agreement
      ref: "Lawyer",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId, // Who created the agreement
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

AgreementSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Agreement = mongoose.model("Agreement", AgreementSchema);

module.exports = Agreement;
