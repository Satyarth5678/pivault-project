const express = require("express");
const router = express.Router();

const {
    startBackup,
    checkBackupStatus,
    getHistory
} = require("../controllers/backup.controller");

const { verifyToken } = require("../middlewares/auth.middleware");
const { isAdmin } = require("../middlewares/role.middleware");

router.post("/run", verifyToken, isAdmin, startBackup);
router.get("/status", verifyToken, checkBackupStatus);
router.get("/history", verifyToken, isAdmin, getHistory);

module.exports = router;