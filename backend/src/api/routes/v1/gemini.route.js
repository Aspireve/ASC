const express = require("express");
const controller = require("../../controllers/gemini.controller");

const router = express.Router();

router.route("/gai").post(controller.geminiPrompts);
router.route("/gaip").post(controller.geminiPromptsPhy);

module.exports = router;
