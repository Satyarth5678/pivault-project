const backupService = require("../services/backup.service");

// =============================
// 🚀 RUN BACKUP (MANUAL)
// =============================
exports.runBackup = async (req, res) => {
    try {
        const result = await backupService.runBackup("manual");
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Backup failed" });
    }
};

// =============================
// 📊 STATUS
// =============================
exports.getStatus = (req, res) => {
    try {
        const status = backupService.getBackupStatus();
        res.json(status);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error getting status" });
    }
};

// =============================
// 📜 HISTORY
// =============================
exports.getBackupHistory = (req, res) => {
    try {
        const history = backupService.getBackupHistory();
        res.json(backupService.getBackupHistory());
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching history" });
    }
};

// =============================
// 🔁 RESTORE
// =============================
const fs = require("fs");
const path = require("path");

const BASE_PATH = process.env.BASE_PATH;
const BACKUP_PATH = process.env.BACKUP_PATH;

const copyFolderRecursive = (source, target) => {
    if (!fs.existsSync(source)) return;

    const files = fs.readdirSync(source);

    files.forEach((file) => {
        const srcPath = path.join(source, file);
        const destPath = path.join(target, file);

        if (fs.lstatSync(srcPath).isDirectory()) {
            fs.mkdirSync(destPath, { recursive: true });
            copyFolderRecursive(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    });
};

exports.restoreBackup = async (req, res) => {
  try {
    const backupName = req.body.backup;

    if (!backupName) {
      return res.status(400).json({ message: "Backup name required" });
    }

    await backupService.restoreBackup(backupName);

    res.json({ message: "Restore completed successfully" });

  } catch (err) {
    console.error("Restore error:", err);
    res.status(500).json({ message: "Restore failed" });
  }
};
