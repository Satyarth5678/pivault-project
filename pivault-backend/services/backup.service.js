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
// 🔁 COPY FUNCTION (FIXED)
// =============================
const copyFolder = (src, dest) => {
    if (!fs.existsSync(src)) {
        throw new Error("Source folder does not exist: " + src);
    }

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
// 🔄 RESTORE BACKUP (FIXED)
// =============================
exports.restoreBackup = async (backupName) => {
    try {
        const backupFolder = path.join(BACKUP_PATH, backupName);
        const destination = path.join(BASE_PATH, "users");

        console.log("🔁 RESTORE START");
        console.log("Backup:", backupFolder);
        console.log("Destination:", destination);

        if (!fs.existsSync(backupFolder)) {
            throw new Error("Backup folder not found");
        }

        // 🔥 Delete old data
        if (fs.existsSync(destination)) {
            fs.rmSync(destination, { recursive: true, force: true });
        }

        fs.mkdirSync(destination, { recursive: true });

        // 🔥 Copy backup → users
        copyFolder(backupFolder, destination);

        // 🔥 VERIFY restore
        const restoredFiles = fs.readdirSync(destination);
        if (restoredFiles.length === 0) {
            throw new Error("Restore failed: No files copied");
        }

        console.log("✅ RESTORE SUCCESS");

        return { success: true, message: "Restore completed successfully" };

    } catch (err) {
        console.error("❌ RESTORE ERROR:", err.message);
        return { success: false, message: err.message };
    }
};

// =============================
// 🚀 RUN BACKUP (UNCHANGED)
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

        return { success: true, message: "Backup completed successfully" };

    } catch (err) {
        console.error("BACKUP ERROR:", err);

        backupState.running = false;
        backupState.currentJob = null;

        return { success: false, message: "Backup failed" };
    }
};

// =============================
// 📊 STATUS
// =============================
exports.getBackupStatus = () => {
    if (backupState.running) return { status: "Running" };
    if (backupHistory.length > 0) return { status: backupHistory[0].status };
    return { status: "Idle" };
};

// =============================
// 📜 HISTORY
// =============================
exports.getBackupHistory = () => backupHistory;
