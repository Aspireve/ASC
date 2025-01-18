const CompanyModal = require("../models/companyprofile");
const UserModel = require("../models/user.model");

exports.createCompany = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const company = new CompanyModal(req.body);
    const savedCompany = await company.save();
    const user = await UserModel.findById(_id);
    user.company.push(savedCompany._id);
    await user.save();
    return res
      .status(200)
      .json({ message: "Company created successfully", data: savedCompany });
  } catch (error) {
    next(error);
  }
};

exports.getCompany = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const company = await UserModel.findById(_id).populate("company");
    return res.status(200).json({ data: company.company });
  } catch (error) {
    next(error);
  }
};
