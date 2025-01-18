const express = require("express");
const controller = require("../../controllers/agreement.controller");
const { authorize, ADMIN, LOGGED_USER } = require("../../middlewares/auth");

const router = express.Router();

router
  .route("/customer")
  .get(authorize(LOGGED_USER), controller.getCustomers)
  .post(authorize(LOGGED_USER), controller.createCustomerCombo);

router.route("/get").get(controller.getSingleCustomer);

router
  .route("/agreement")
  .post(authorize(LOGGED_USER), controller.createAgreement);

router
  .route("/approve")
  .post(authorize(LOGGED_USER), controller.approveAgreement);

router.route("/add-terms").post(authorize(LOGGED_USER), controller.addTerms);

router
  .route("/issue-to-lawyer")
  .post(authorize(LOGGED_USER), controller.issueToLawyer);

router
  .route("/complete")
  .post(authorize(LOGGED_USER), controller.completeAgreement);

router
  .route("/verifyDocument")
  .post(authorize(LOGGED_USER), controller.verifyAgreement);

router
  .route("/get-all-agreements")
  .post(authorize(LOGGED_USER), controller.getAllAgreements);

module.exports = router;
