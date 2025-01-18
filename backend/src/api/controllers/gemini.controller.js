const { GoogleGenerativeAI } = require("@google/generative-ai");
const Agreement = require("../models/agreement");
const { GEMMINI } = require("../../config/vars");

exports.geminiPrompts = async (req, res, next) => {
  try {
    const genAI = new GoogleGenerativeAI(GEMMINI);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const { agreeId } = req.body;
    const agreement = await Agreement.findById(agreeId).populate(
      "company lawyer createdBy"
    );
    const { title, content, revisions, status, company } = agreement;

    const prompt = `
 You are a senior legal counsel with extensive experience in ${company.type} organizations. Review the following ${title} agreement and provide 2-3 high-priority recommendations, considering:

1. Legal and compliance requirements specific to ${company.type} sector
2. Security considerations and data protection obligations
3. Risk mitigation strategies
4. Organizational benefits and potential drawbacks
5. Industry best practices and regulatory standards

Agreement Content:
${content}

Please structure your response with:
- Brief context of why each recommendation is crucial
- Specific sections of the agreement that need attention
- Practical suggestions for improvement
- Potential implications if not addressed

Requirements:
- Total response must not exceed 100 words
- Each recommendation should be concise yet comprehensive
- Focus on the most critical points only

Format each recommendation with clear headings and actionable insights. Consider both immediate and long-term impacts on the organization.
`;
    const response = await model.generateContent(
      `${prompt} ${content} ${title} ${revisions} ${status}`
    );
    return res.status(200).json({ data: await response.response.text() });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
