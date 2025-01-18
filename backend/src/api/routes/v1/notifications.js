const express = require("express");
const controller = require("../../controllers/notification.controller");
const { authorize, ADMIN, LOGGED_USER } = require("../../middlewares/auth");

const router = express.Router();

router
  .route("/notif")
  .get(authorize(LOGGED_USER), controller.getNotifications)
  .post(authorize(LOGGED_USER), controller.setNotificationAsread);

module.exports = router;
