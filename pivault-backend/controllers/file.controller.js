const path = require("path");
const fs = require("fs");

// 🔥 BASE STORAGE PATH 
const BASE_PATH = process.env.BASE_PATH || (
    process.env.NODE_ENV === "production" ?
    "/mnt/PiVaultStorage" : "F:/PiVaultStorage"
);

// ============================= // 📦 HELPER → GET FOLDER SIZE // ============================= 
const getFolderSize = (dirPath) => {
    let total = 0;

    if (!fs.existsSync(dirPath))
        return 0;

    const files = fs.readdirSync(dirPath);

    files.forEach((file) => {
        const fullPath = path.join(dirPath, file);

        if (fs.lstatSync(fullPath).isDirectory()) {
            total += getFolderSize(fullPath);
        } else {
            total += fs.statSync(fullPath).size;
        }

    });

    return total;
};

// ============================= // 📦 HELPER → READ USERS JSON // ============================= 
const USERS_FILE = path.join(__dirname, "../data/users.json");

const readUsers = () => { if (!fs.existsSync(USERS_FILE)) return []; return JSON.parse(fs.readFileSync(USERS_FILE)); };

// ============================= // 📂 GET FILES // ============================= 
exports.getFiles = (req, res) => {
    const { type, path: subPath = "" } = req.query;

    const user = req.user.username; const role = req.user.role;

    let folderPath;

    if (type === "user") { if (role === "admin") { folderPath = subPath ? path.join(BASE_PATH, "users", subPath) : path.join(BASE_PATH, "users"); } else { if (!subPath) { folderPath = path.join(BASE_PATH, "users"); } else { if (subPath && !subPath.startsWith(user)) { return res.status(403).json({ message: "Access denied" }); } folderPath = path.join(BASE_PATH, "users", subPath); } } } else if (type === "shared") { folderPath = path.join(BASE_PATH, "shares", subPath); } else { return res.status(403).json({ message: "Access denied" }); }

    fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
        if (err) return res.status(500).json({ message: err.message });

        res.json(
            files.map((f) => ({
                name: f.name,
                isDirectory: f.isDirectory(),
                accessible: role === "admin" || f.name === user,
            }))
        );

    });
};

// ============================= // ⬆️ UPLOAD FILE // ============================= 
exports.uploadFile = (req, res) => {
    try {
        const { path: subPath = "", type = "user" } = req.query;

        const user = req.user.username;
        const role = req.user.role;

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        let targetFolder;

        if (type === "shared") {
            targetFolder = path.join(BASE_PATH, "shares", subPath);
        } else {
            if (role === "admin") {
                targetFolder = path.join(BASE_PATH, "users", subPath || user);
            } else {
                if (!subPath.startsWith(user)) {
                    return res.status(403).json({ message: "Access denied" });
                }
                targetFolder = path.join(BASE_PATH, "users", subPath);
            }
        }

        if (!fs.existsSync(targetFolder)) {
            fs.mkdirSync(targetFolder, { recursive: true });
        }

        // =============================
        // 📊 STORAGE LIMIT CHECK
        // =============================
        if (type !== "shared") {
            const users = readUsers();

            const targetUser = subPath ? subPath.split("/")[0] : user;

            const userData = users.find((u) => u.username === targetUser);

            if (!userData) {
                return res.status(404).json({ message: "User not found" });
            }

            const usedBytes = getFolderSize(
                path.join(BASE_PATH, "users", targetUser)
            );

            const fileSize = req.file.buffer.length;

            const limitMB = Number(userData.storageLimit);

            if (!limitMB || isNaN(limitMB)) {
                return res.status(403).json({
                    message: "🚫 No storage assigned to this user",
                });
            }

            const limitBytes = limitMB * 1024 * 1024;

            if (usedBytes + fileSize > limitBytes) {
                return res.status(403).json({
                    message: "🚫 Upload failed: File exceeds storage limit",
                });
            }
        }

        const filePath = path.join(targetFolder, req.file.originalname);

        fs.writeFileSync(filePath, req.file.buffer);

        res.json({ message: "File uploaded successfully ✅" });

    } catch (err) { console.error("UPLOAD ERROR:", err); res.status(500).json({ message: "Upload failed" }); }
};

// ============================= // ❌ DELETE FILE // ============================= 
exports.deleteFile = (req, res) => {
    const { file, path: subPath = "", type = "user" } = req.query;

    const user = req.user.username; const role = req.user.role;

    let filePath;

    if (type === "shared") { if (role !== "admin") { return res.status(403).json({ message: "Only admin can delete shared files" }); } filePath = path.join(BASE_PATH, "shares", subPath, file); } else { if (role === "admin") { filePath = path.join(BASE_PATH, "users", subPath, file); } else { if (!subPath.startsWith(user)) { return res.status(403).json({ message: "Access denied" }); } filePath = path.join(BASE_PATH, "users", subPath, file); } }

    fs.unlink(filePath, (err) => {
        if (err) return res.status(500).json({ message: err.message });

        res.json({ message: "File deleted successfully" });

    });
};

// ============================= // 📊 GET STORAGE USAGE // ============================= 
exports.getStorageUsage = (req, res) => {
    try {
        const { user, role } = req.query;

        const users = readUsers();

        if (role === "admin") {
            const result = users.map((u) => {
                const usedBytes = getFolderSize(
                    path.join(BASE_PATH, "users", u.username)
                );

                return {
                    username: u.username,
                    used: (usedBytes / (1024 * 1024)).toFixed(2),
                    limit: u.storageLimit === 0 ? "Unlimited" : u.storageLimit,
                };
            });

            return res.json(result);
        }

        const userData = users.find((u) => u.username === user);

        const usedBytes = getFolderSize(
            path.join(BASE_PATH, "users", user)
        );

        res.json({
            username: user,
            used: (usedBytes / (1024 * 1024)).toFixed(2),
            limit: userData?.storageLimit || 0,
        });

    } catch (err) { console.error(err); res.status(500).json({ message: "Error getting storage usage" }); }
};

// ============================= // ⬇ DOWNLOAD FILE // ============================= 
exports.downloadFile = (req, res) => {
    const { file, path: subPath = "", type = "user" } = req.query;

    const user = req.user.username; const role = req.user.role;

    let filePath;

    if (type === "shared") { filePath = path.join(BASE_PATH, "shares", subPath, file); } else { if (role === "admin") { filePath = path.join(BASE_PATH, "users", subPath || user, file); } else { if (!subPath.startsWith(user)) { return res.status(403).json({ message: "Access denied" }); } filePath = path.join(BASE_PATH, "users", subPath, file); } }

    res.download(filePath);
};