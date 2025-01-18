const express = require("express");
const controller = require("../../controllers/lawyer.controller");
const { authorize, ADMIN, LOGGED_USER } = require("../../middlewares/auth");

const router = express.Router();

router.route("/addLawyer").post(authorize(LOGGED_USER), controller.addLawyer);

router
  .route("/lawyerLogin")
  .post(authorize(LOGGED_USER), controller.loginLawyer);

module.exports = router;
