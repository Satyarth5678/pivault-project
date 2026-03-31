const fs = require("fs");
const path = require("path");

// =============================
// 📂 PATHS
// =============================
const BASE_PATH = process.env.BASE_PATH || (
    process.env.NODE_ENV === "production"
        ? "/mnt/PiVaultStorage"
        : "F:/PiVaultStorage"
);

const BACKUP_PATH = process.env.BACKUP_PATH || (
    process.env.NODE_ENV === "production"
        ? "/mnt/PiVaultBackup"
        : "F:/PiVaultBackup"
);

// =============================
// 📊 STATE
// =============================
let backupState = {
    running: false,
    currentJob: null
};

let backupHistory = [];

// =============================
// 🔁 COPY FUNCTION
// =============================
const copyFolder = (src, dest) => {
    if (!fs.existsSync(src)) return;

    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    const files = fs.readdirSync(src);

    files.forEach((file) => {
        const srcPath = path.join(src, file);
        const destPath = path.join(dest, file);

        if (fs.lstatSync(srcPath).isDirectory()) {
            copyFolder(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    });
};

// =============================
// 🚀 RUN BACKUP (FINAL)
// =============================
exports.runBackup = async (type = "manual") => {
    if (backupState.running) {
        return { message: "Backup already running" };
    }

    const jobId = Date.now();

    backupState.running = true;
    backupState.currentJob = {
        id: jobId,
        type,
        startTime: new Date().toISOString(),
        status: "In Progress"
    };

    try {
        if (!fs.existsSync(BACKUP_PATH)) {
            fs.mkdirSync(BACKUP_PATH, { recursive: true });
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const backupName = `backup-${timestamp}`;
        const backupFolder = path.join(BACKUP_PATH, backupName);

        fs.mkdirSync(backupFolder);

        const source = path.join(BASE_PATH, "users");

        // 🔥 REAL COPY
        copyFolder(source, backupFolder);

        const endTime = new Date().toISOString();

        const completedJob = {
            id: jobId,
            name: backupName,
            type,
            startTime: backupState.currentJob.startTime,
            endTime,
            status: "Completed",
            durationSeconds: 1
        };

        backupHistory.unshift(completedJob);

        backupState.running = false;
        backupState.currentJob = null;

        return { message: "Backup completed successfully" };

    } catch (err) {
        console.error("BACKUP ERROR:", err);

        backupState.running = false;
        backupState.currentJob = null;

        return { message: "Backup failed" };
    }
};

// =============================
// 📊 STATUS
// =============================
exports.getBackupStatus = () => backupState;

// =============================
// 📜 HISTORY
// =============================
exports.getBackupHistory = () => backupHistory;