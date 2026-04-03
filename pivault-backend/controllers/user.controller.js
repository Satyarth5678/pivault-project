const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");

// =============================
// 📁 PATH CONFIG
// =============================
const USERS_FILE = path.join(__dirname, "../data/users.json");

const BASE_PATH = process.env.BASE_PATH || (
    process.env.NODE_ENV === "production"
        ? "/mnt/PiVaultStorage"
        : "F:/PiVaultStorage"
);

// =============================
// 📦 HELPER → READ USERS
// =============================
const readUsers = () => {
    if (!fs.existsSync(USERS_FILE)) return [];
    return JSON.parse(fs.readFileSync(USERS_FILE));
};

// =============================
// 💾 SAVE USERS
// =============================
const saveUsers = (users) => {
    const dir = path.dirname(USERS_FILE);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

// =============================
// 📦 HELPER → GET FOLDER SIZE
// =============================
const getFolderSize = (folderPath) => {
    let totalSize = 0;

    if (!fs.existsSync(folderPath)) return 0;

    const files = fs.readdirSync(folderPath);

    files.forEach((file) => {
        const filePath = path.join(folderPath, file);

        if (fs.lstatSync(filePath).isDirectory()) {
            totalSize += getFolderSize(filePath);
        } else {
            totalSize += fs.statSync(filePath).size;
        }
    });

    return totalSize;
};

// =============================
// 📋 GET USERS (WITH STORAGE USED)
// =============================
exports.getUsers = (req, res) => {
    try {
        const users = readUsers();

        const updatedUsers = users.map((user) => {
            const userFolder = path.join(BASE_PATH, "users", user.username);

            const usedBytes = getFolderSize(userFolder);
            const usedMB = (usedBytes / (1024 * 1024)).toFixed(2);

            return {
                ...user,
                usedStorage: Number(usedMB),
            };
        });

        res.json(updatedUsers);
    } catch (err) {
        res.status(500).json({ message: "Error fetching users" });
    }
};

// =============================
// 📊 STORAGE USAGE API (FIXED)
// =============================
exports.getStorageUsage = (req, res) => {
    try {
        const users = readUsers();

        const result = users.map((user) => {
            const userFolder = path.join(BASE_PATH, "users", user.username);

            const usedBytes = getFolderSize(userFolder);
            const usedMB = Number((usedBytes / (1024 * 1024)).toFixed(2));

            const limit = user.storageLimit === null ? null : Number(user.storageLimit);

            return {
                username: user.username,
                role: user.role,
                used: usedMB,
                limit: limit,
                percentage:
                    limit === null
                        ? 0
                        : Number(((usedMB / limit) * 100).toFixed(1)),
            };
        });

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching storage usage" });
    }
};

// =============================
// ➕ CREATE USER (FIXED)
// =============================
exports.createUser = async (req, res) => {
  try {
    const { username, password, storageLimit } = req.body;

    // 🔐 RBAC CHECK (SECURE)
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    // 🛑 VALIDATION
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }

    const users = readUsers();

    // 🔍 CHECK USER EXISTS
    if (users.find((u) => u.username === username)) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 🔐 HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // 👤 CREATE USER OBJECT
    const newUser = {
      username,
      password: hashedPassword,
      role: "user",
      storageLimit:
        storageLimit === undefined || storageLimit === null || storageLimit === ""
          ? 100
          : Number(storageLimit)
    };

    users.push(newUser);
    saveUsers(users);

    console.log("✅ USER CREATED:", username);

    // 📁 CREATE USER FOLDER
    const userFolder = path.join(BASE_PATH, "users", username);

    if (!fs.existsSync(userFolder)) {
      fs.mkdirSync(userFolder, { recursive: true });
      console.log("📁 Folder created:", userFolder);
    }

    // ✅ RESPONSE
    res.json({
      success: true,
      message: `User ${username} created successfully ✅`
    });

  } catch (err) {
    console.error("CREATE USER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// =============================
// ❌ DELETE USER (ADMIN ONLY)
// =============================
exports.deleteUser = (req, res) => {
    const username = req.query.username;
    const role = req.query.role;

    if (role !== "admin") {
        return res.status(403).json({ message: "Admin only" });
    }

    let users = readUsers();

    users = users.filter((u) => u.username !== username);
    saveUsers(users);

    // ❗ DELETE USER FOLDER
    const userFolder = path.join(BASE_PATH, "users", username);
    if (fs.existsSync(userFolder)) {
        fs.rmSync(userFolder, { recursive: true, force: true });
    }

    res.json({ message: "User deleted successfully" });
};
