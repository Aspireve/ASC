const CompanyModal = require("../models/companyprofile");
const Lawyer = require("../models/lawyer.model");
const LawyerModal = require("../models/lawyer.model");
const userModel = require("../models/user.model");
const mongoose = require("mongoose");

exports.addLawyer = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const use = await userModel.findById(_id);
    const { ...rest } = req.body;
    const company = await CompanyModal.findById(use.company[0]);
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

exports.getLawyersForCompany = async (req, res) => {
  try {
    const { companyId } = req.query;
    const lawyers = await Lawyer.find({ company: [companyId] }).populate(
      "company"
    );

    res.status(200).json(lawyers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
