const express = require("express");
const router = express.Router();

const { getSystemStatus } = require("../controllers/dashboard.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const { isAdmin } = require("../middlewares/role.middleware");

// Protected for all logged-in users
router.get("/status", verifyToken, getSystemStatus);

// Admin-only test route
router.get("/admin-test", verifyToken, isAdmin, (req, res) => {
    res.json({ message: "Admin access granted" });
});

module.exports = router;