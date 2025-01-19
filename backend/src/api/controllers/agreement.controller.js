const Customer = require("../models/customer.model");
const User = require("../models/user.model");
const Company = require("../models/companyprofile");
const AgreementModal = require("../models/agreement");
const notificationModel = require("../models/notification.model");
const { sendMail } = require("./mail.controller");
const { welcome } = require("../services/welcomeTemplate");

function sha1(message) {
  function rotateLeft(n, s) {
    return (n << s) | (n >>> (32 - s));
  }

  function toHexStr(n) {
    let s = "",
      v;
    for (let i = 7; i >= 0; i--) {
      v = (n >>> (i * 4)) & 0x0f;
      s += v.toString(16);
    }
    return s;
  }
  const utf8Encode = new TextEncoder().encode(message);
  const msg = Array.from(utf8Encode);

  const msgLength = msg.length;
  msg.push(0x80);
  while ((msg.length + 8) % 64 !== 0) {
    msg.push(0);
  }

  const msgBitLength = msgLength * 8;
  for (let i = 7; i >= 0; i--) {
    msg.push((msgBitLength >>> (i * 8)) & 0xff);
  }

  let h0 = 0x67452301;
  let h1 = 0xefcdab89;
  let h2 = 0x98badcfe;
  let h3 = 0x10325476;
  let h4 = 0xc3d2e1f0;

  for (let i = 0; i < msg.length; i += 64) {
    const chunk = msg.slice(i, i + 64);

    const words = [];
    for (let j = 0; j < 16; j++) {
      words[j] =
        (chunk[j * 4] << 24) |
        (chunk[j * 4 + 1] << 16) |
        (chunk[j * 4 + 2] << 8) |
        chunk[j * 4 + 3];
    }
    for (let j = 16; j < 80; j++) {
      words[j] = rotateLeft(
        words[j - 3] ^ words[j - 8] ^ words[j - 14] ^ words[j - 16],
        1
      );
    }
    let a = h0;
    let b = h1;
    let c = h2;
    let d = h3;
    let e = h4;

    for (let j = 0; j < 80; j++) {
      let f, k;
      if (j < 20) {
        f = (b & c) | (~b & d);
        k = 0x5a827999;
      } else if (j < 40) {
        f = b ^ c ^ d;
        k = 0x6ed9eba1;
      } else if (j < 60) {
        f = (b & c) | (b & d) | (c & d);
        k = 0x8f1bbcdc;
      } else {
        f = b ^ c ^ d;
        k = 0xca62c1d6;
      }
      const temp = (rotateLeft(a, 5) + f + e + k + words[j]) >>> 0;
      e = d;
      d = c;
      c = rotateLeft(b, 30);
      b = a;
      a = temp;
    }
    h0 = (h0 + a) >>> 0;
    h1 = (h1 + b) >>> 0;
    h2 = (h2 + c) >>> 0;
    h3 = (h3 + d) >>> 0;
    h4 = (h4 + e) >>> 0;
  }
  return (
    toHexStr(h0) + toHexStr(h1) + toHexStr(h2) + toHexStr(h3) + toHexStr(h4)
  );
}

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

exports.getSingleCustomer = async (req, res, next) => {
  try {
    const { _id } = req.query;
    const customer = await Customer.findOne({
      userId: _id,
    }).populate("creator creatorCompany customerCompany userId");
    return res.status(200).json(customer);
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

    const cust = await Customer.findOne({ userId: customer }).populate(
      "userId creator"
    );
    const agreement = new AgreementModal({
      title,
      content,
      createdBy,
      customer: cust._id,
      status: "Draft",
      effectiveDate: new Date(),
      company: u.company[0],
    });

    await agreement.save();

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

    console.log("here");

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
    const { name } = req.user;
    const { _id } = req.query;

    const agreement = await AgreementModal.findById(_id).populate(
      "createdBy customer"
    );

    console.log(agreement.createdBy.name, name);
    agreement.signature = sha1(`${agreement.createdBy.name} ${name}`);

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
    const agreement = await AgreementModal.find(req.body).populate(
      "company lawyer createdBy"
    );
    return res.status(200).json(agreement);
  } catch (error) {
    next(error);
  }
};

exports.verifyAgreement = async (req, res, next) => {
  try {
    const { _id } = req.query;
    const { creatorName, customerName } = req.body;

    const agreement = await AgreementModal.findById(_id);
    const sig = sha1(`${creatorName} ${customerName}`);
    if (agreement.signature === sig) {
      return res.status(200).json({ message: "Agreement verified" });
    }
    throw new Error("Agreement not verified");
  } catch (error) {
    next(error);
  }
};
