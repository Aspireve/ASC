const { Resend: resendA } = require("./vars");
const { Resend } = require("resend");

const ResendConfig = new Resend(resendA);

module.exports = ResendConfig;
