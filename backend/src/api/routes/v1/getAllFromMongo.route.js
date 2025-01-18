const express = require("express");
const controller = require("../../controllers/getAllFromMongo.controller");

const router = express.Router();

router.route("/get").get(controller.getAllData);

module.exports = router;
