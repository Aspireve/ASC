const Customer = require("../models/customer.model");
const User = require("../models/user.model");
const Company = require("../models/companyprofile");

// Get all customers of a certain company or user
exports.getCustomers = async (req, res) => {
  try {
    const { companyId, userId } = req.query;
    let customers;

    if (companyId) {
      customers = await Customer.find({
        $or: [{ creatorCompany: companyId }, { customerCompany: companyId }],
      }).populate("creator creatorCompany customerCompany userId");
    } else if (userId) {
      customers = await Customer.find({ creator: userId }).populate(
        "creator creatorCompany customerCompany userId"
      );
    } else {
      return res
        .status(400)
        .json({ message: "companyId or userId is required" });
    }

    return res.status(200).json(customers);
  } catch (error) {
    NOT_EXTENDED(error);
  }
};

// Create a user, company, and customer company combo
exports.createCustomerCombo = async (req, res) => {
  try {
    const { _id } = req.user;
    const use = await User.findById(_id);
    const { userId } = req.body;

    const creator = await User.findById(_id);
    const creatorCompany = await Company.findById(use.company[0]);
    const user = await User.findById(userId);
    const customerCompany = await Company.findById(user.company[0]);

    if (!creator || !creatorCompany || !customerCompany || !user) {
      return res.status(400).json({
        message: "Invalid creator, creator company, customer company, or user",
      });
    }

    const customer = new Customer({
      creator: _id,
      creatorCompany: creatorCompany._id,
      customerCompany: customerCompany._id,
      userId: userId,
    });

    await customer.save();

    return res.status(201).json(customer);
  } catch (error) {
    next(error);
  }
};
