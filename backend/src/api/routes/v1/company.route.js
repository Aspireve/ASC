const express = require("express");
const controller = require("../../controllers/company.controller");
const { authorize, ADMIN, LOGGED_USER } = require("../../middlewares/auth");

const router = express.Router();

router
  .route("/create")
  .get(authorize(LOGGED_USER), controller.getCompany)
  .post(authorize(LOGGED_USER), controller.createCompany);

module.exports = router;
