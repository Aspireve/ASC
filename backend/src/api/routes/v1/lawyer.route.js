const express = require("express");
const controller = require("../../controllers/lawyer.controller");
const { authorize, ADMIN, LOGGED_USER } = require("../../middlewares/auth");

const router = express.Router();

router
  .route("/addLawyer")
  .get(authorize(LOGGED_USER), controller.getLawyersForCompany)
  .post(authorize(LOGGED_USER), controller.addLawyer);

router
  .route("/lawyerLogin")
  .post(controller.loginLawyer);

module.exports = router;
