const Agreement = require("../models/agreement");
const Customer = require("../models/customer.model");
const userModel = require("../models/user.model");

function calculateDaysBetween(startDateISO, endDateISO) {
    const start = new Date(startDateISO); // Parse ISO date
    const end = new Date(endDateISO); // Parse ISO date
  
    // Calculate the difference in milliseconds and convert to days
    const differenceInDays = (end - start) / (1000 * 60 * 60 * 24);
  
    return differenceInDays;
  }

exports.previousDataTaken = async (req, res, next) => {
  try {
    const { name, email, title, startDate, endDate } = req.body;
    const currUser = await userModel.findById(req.user._id);
    const newCustomer = await new userModel({ email, name }).save();

    const customer = await new Customer({
      creator: currUser._id,
      creatorCompany: currUser.company[0],
      customerCompany: newCustomer.company[0],
      userId: newCustomer._id,
    }).save();

    const agree = await new Agreement({
      title,
      content: "Uploaded Previously",
      createdBy: currUser._id,
      customer: customer._id,
      status: "Accepted",
      effectiveDate: new Date(),
      company: currUser.company[0],
      expiryDate: calculateDaysBetween(startDate, endDate),
    }).save();

    return res.status(201).json({agree, customer});
  } catch (error) {
    next(error);
  }
};
