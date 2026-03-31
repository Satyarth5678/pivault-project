const fs = require("fs");
const path = require("path");

const BASE_PATH = process.env.BASE_PATH;
const BACKUP_PATH = process.env.BACKUP_PATH;

const ensureDir = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log("Created:", dirPath);
    }
};

const initStorage = () => {
    if (!BASE_PATH || !BACKUP_PATH) {
        console.error("❌ BASE_PATH or BACKUP_PATH not set");
        return;
    }

    // Storage structure
    ensureDir(BASE_PATH);
    ensureDir(path.join(BASE_PATH, "users"));
    ensureDir(path.join(BASE_PATH, "shared"));

    // Backup folder
    ensureDir(BACKUP_PATH);

    console.log("✅ Storage initialized");
};

module.exports = initStorage;