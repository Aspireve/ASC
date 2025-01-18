const { GoogleGenerativeAI } = require("@google/generative-ai");
const Agreement = require("../models/agreement");
const { GEMMINI } = require("../../config/vars");

exports.geminiPrompts = async (req, res, next) => {
  try {
    const genAI = new GoogleGenerativeAI(GEMMINI);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = "Explain how AI works";
    const { agreeId } = req.body;
    const agreement = await Agreement.findById(agreeId).populate(
      "company lawyer createdBy"
    );
    const { title, content, revisions, status } = agreement;
    console.log("whyyyy")
    const response = await model.generateContent(
      `${prompt} ${content} ${title} ${revisions} ${status}`
    );
    return res.status(200).json({ data: await response.response.text() });
  } catch (error) {
    console.log(error)
    next(error);
  }
};
