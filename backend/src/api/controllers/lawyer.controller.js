const CompanyModal = require("../models/companyprofile");
const Lawyer = require("../models/lawyer.model");
const LawyerModal = require("../models/lawyer.model");

exports.addLawyer = async (req, res, next) => {
  try {
    const { _id, ...rest } = req.body;
    const company = await CompanyModal.findById(_id);
    const newlaywer = new LawyerModal(rest);
    newlaywer.company.push(company._id);
    await newlaywer.save();
    return res.status(201).json(newlaywer);
  } catch (error) {
    next(error);
  }
};

exports.loginLawyer = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const lawyer = await Lawyer.findOne({ email, password });
    if (!lawyer) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    return res.status(200).json(lawyer);
  } catch (error) {
    next(error);
  }
};
