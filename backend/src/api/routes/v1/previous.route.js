const express = require("express");
const controller = require("../../controllers/previous.controller");
const { authorize, ADMIN, LOGGED_USER } = require("../../middlewares/auth");

const router = express.Router();

router
  .route("/prev")
  .post(authorize(LOGGED_USER), controller.previousDataTaken);

module.exports = router;
