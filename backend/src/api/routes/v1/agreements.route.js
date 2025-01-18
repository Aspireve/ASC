const express = require("express");
const controller = require("../../controllers/agreement.controller");
const { authorize, ADMIN, LOGGED_USER } = require("../../middlewares/auth");

const router = express.Router();

router
  .route("/customer")
  .get(authorize(LOGGED_USER), controller.getCustomers)
  .post(authorize(LOGGED_USER), controller.createCustomerCombo);

module.exports = router;
