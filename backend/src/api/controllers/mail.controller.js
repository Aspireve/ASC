const ResendConfig = require("../../config/resend");

exports.sendMail = async (to, subject, html, from = "info@vighnotech.com", attachments = []) => {
  try {
    const mailOptions = {
      from: from,
      to: to,
      subject: subject,
      html: html,
      attachments: attachments,
    };
    const response = await ResendConfig.emails.send(mailOptions);
    return response;
  } catch (error) {
    throw error;
  }
};
