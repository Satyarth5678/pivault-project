const express = require("express");
const router = express.Router();

const systemController = require("../controllers/system.controller");

router.get("/", systemController.getSystemInfo);

module.exports = router;