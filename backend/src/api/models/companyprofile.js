const mongoose = require("mongoose");
const Lawyer = require("./lawyer.model");

const CompanySchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId, // Unique identifier for the company
      default: () => new mongoose.Types.ObjectId(),
      immutable: true,
    },
    name: {
      type: String,
    },
    logoUrl: {
      type: String,
    },
    industry: {
      type: String,
    },
    description: {
      type: String,
    },
    address: {
      type: String,
    },
    country: {
      type: String,
    },
    contactDetails: {
      email: {
        type: String,
      },
      phone: {
        type: String,
      },
      website: {
        type: String,
      },
    },
    registrationDetails: {
      registrationNumber: {
        type: String,
      },
      dateOfIncorporation: {
        type: Date,
      },
      registeredCountry: {
        type: String,
      },
    },
    agreements: [
      {
        agreementId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Agreement",
        },
        title: {
          type: String,
        },
        status: {
          type: String,
          enum: ["active", "expired", "in_review"],
          default: "in_review",
        },
        expiryDate: {
          type: Date,
        },
      },
    ],
    type: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

CompanySchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

CompanySchema.post("save", async function (doc, next) {
  try {
    if (doc.isNew) {
      console.log("here")
      const lawyer = new Lawyer({
        name: "Mike Ross", // Set default name or dynamically generate
        email: `${doc.name
          .toLowerCase()
          .replace(/\s/g, "_")}${Date.now()}@gmail.com`,
        phone: "0000000000",
        licenseNumber: `LICENSE-${Date.now()}`, // Dynamically generate a unique license number
        associatedCompanies: [doc._id],
      });

      await lawyer.save();
      console.log(`Lawyer created for company: ${doc.name}`);
    }
    next();
  } catch (error) {
    console.error("Error creating lawyer:", error);
    next(error); // Pass error to next middleware if any
  }
  next();
});

const Company = mongoose.model("Company", CompanySchema);

module.exports = Company;
