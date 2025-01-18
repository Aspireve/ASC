const express = require("express");
const controller = require("../../controllers/gemini.controller");

const router = express.Router();

router.route("/gai").post(controller.geminiPrompts);

module.exports = router;
