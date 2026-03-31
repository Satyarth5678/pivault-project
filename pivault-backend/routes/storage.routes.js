const express = require("express");
const router = express.Router();

const { getHealthStatus } = require("../controllers/storage.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

router.get("/health", verifyToken, getHealthStatus);

module.exports = router;