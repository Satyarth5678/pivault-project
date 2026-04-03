const express = require("express");
const router = express.Router();

const backupController = require("../controllers/backup.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

// ✅ RUN BACKUP (FIXED ROUTE NAME)
router.post("/start", verifyToken, backupController.runBackup);

// ✅ STATUS
router.get("/status", verifyToken, backupController.getStatus);

// ✅ HISTORY
router.get("/history", verifyToken, backupController.getBackupHistory);

// ✅ RESTORE
router.post("/restore", verifyToken, backupController.restoreBackup);

module.exports = router;
