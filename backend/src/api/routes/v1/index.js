const express = require("express");
const userRoutes = require("./user.route");
const authRoutes = require("./auth.route");
const notificationRoutes = require("./notifications");
const companyRoutes = require("./company.route");
const lawyerRoutes = require("./lawyer.route");
const agreeRoutes = require("./agreements.route");
const getRoutes = require("./getAllFromMongo.route");
const geminiRoutes = require("./gemini.route");

const router = express.Router();

/**
 * GET v1/status
 */
router.get("/status", (req, res) => res.send("OK"));

/**
 * GET v1/docs
 */
router.use("/docs", express.static("docs"));

router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/company", notificationRoutes);
router.use("/notifications", notificationRoutes);
router.use("/company", companyRoutes);
router.use("/lawyer", lawyerRoutes);
router.use("/agree", agreeRoutes);
router.use("/get", getRoutes);
router.use("/ai", geminiRoutes);

module.exports = router;
