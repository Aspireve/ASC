const Customer = require("../models/customer.model");
const User = require("../models/user.model");
const Company = require("../models/companyprofile");
const AgreementModal = require("../models/agreement");
const notificationModel = require("../models/notification.model");
const { sendMail } = require("./mail.controller");
const { welcome } = require("../services/welcomeTemplate");

// Get all customers of a certain company or user
exports.getCustomers = async (req, res, next) => {
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
    next(error);
  }
};

// Create a user, company, and customer company combo
exports.createCustomerCombo = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { email, name } = req.body;
    const creator = await User.findById(_id);
    const creatorCompany = await Company.findById(creator.company[0]);
    const user = await new User({ email, name }).save();
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
      userId: user._id,
    });

    await customer.save();

    const abc = await Customer.findById(customer._id).populate(
      "creator creatorCompany customerCompany userId"
    );

    return res.status(201).json(abc);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.createAgreement = async (req, res) => {
  try {
    const { _id: createdBy } = req.user;
    const { title, content, customer } = req.body;

    const u = await User.findById(createdBy);

    const agreement = new AgreementModal({
      title,
      content,
      createdBy,
      customer,
      status: "Draft",
      effectiveDate: new Date(),
      company: u.company[0],
    });

    await agreement.save();

    const cust = await Customer.findById(customer).populate("userId creator");

    const passwordTemplate = welcome
      .replace("[Recipient Name]", cust.userId.name)
      .replace("[Creator Name]", cust.creator.name)
      .replace("[Agreement Title]", `[${title}]`)
      .replace("[Recipient Email]", cust.userId.email)
      .replace("[LINK]", "email")
      .replace("[YourAppName]", "Vighnotech")
      .replace("[Year] YourAppName", "2025 Vighnotech");

    await sendMail(
      "1032210418@tcetmumbai.in",
      "[Welcome] You have recieved an agreement",
      passwordTemplate,
      "info@vighnotech.com"
    );

    console.log("here")

    return res.status(201).json(agreement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.approveAgreement = async (req, res, next) => {
  try {
    const { _id } = req.query;
    const { content } = req.body;
    const agreement = await AgreementModal.findById(_id);
    agreement.content = content;
    agreement.status = "Ready";
    await agreement.save();
    return res.status(200).json(agreement);
  } catch (error) {
    next(error);
  }
};

exports.addTerms = async (req, res, next) => {
  try {
    const { _id } = req.query;
    const { changes } = req.body;

    const agreement = await AgreementModal.findById(_id);
    const customer = await Customer.findById(agreement.customer[0]);
    agreement.revisions.push({
      revisionNumber: agreement.revisions.length,
      changes,
      revisedBy: customer.userId,
    });
    agreement.status = "Issue";
    await agreement.save();
    return res.status(200).json(agreement);
  } catch (error) {
    next(error);
  }
};

exports.issueToLawyer = async (req, res, next) => {
  try {
    const { _id } = req.query;
    const { content, changes } = req.body;

    const agreement = await AgreementModal.findById(_id);
    const customer = await Customer.findById(agreement.customer[0]);
    agreement.content = content;
    agreement.revisions.push({
      revisionNumber: agreement.revisions.length,
      changes,
      revisedBy: customer.userId,
    });
    agreement.status = "Ready";
    await agreement.save();
    return res.status(200).json(agreement);
  } catch (error) {
    next(error);
  }
};

exports.completeAgreement = async (req, res, next) => {
  try {
    const { _id } = req.query;

    const agreement = await AgreementModal.findById(_id);
    agreement.status = "Accepted";
    agreement.save();

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + agreement.expiryDate);

    const notifi = new notificationModel({
      userId: agreement.createdBy,
      agreement: agreement._id,
      dateToDisplay: expiryDate,
    });
    await notifi.save();
    return res.status(200).json(agreement);
  } catch (error) {
    next(error);
  }
};

exports.getAllAgreements = async (req, res, next) => {
  try {
    const agreement = await AgreementModal.find(req.body);
    return res.status(200).json(agreement);
  } catch (error) {
    next(error);
  }
};
