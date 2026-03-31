const express = require("express");
const router = express.Router();

const backupController = require("../controllers/backup.controller");

// ✅ RUN BACKUP
router.post("/run", backupController.runBackup);

// ✅ STATUS
router.get("/status", backupController.getStatus);

// ✅ HISTORY
router.get("/history", backupController.getBackupHistory);

// ✅ RESTORE
router.post("/restore", backupController.restoreBackup);

module.exports = router;