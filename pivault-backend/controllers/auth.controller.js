const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");

const USERS_FILE = path.join(__dirname, "../data/users.json");
const SECRET = "pivault-secret";

const readUsers = () => {
    return JSON.parse(fs.readFileSync(USERS_FILE));
};
exports.login = async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Missing credentials" });
    }

    const users = readUsers(); // your function

    const user = users.find(u => u.username === username);

    if (!user) {
      return res.status(401).json({ message: "Invalid username" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { username: user.username, role: user.role },
      "pivault-secret",
      { expiresIn: "1d" }
    );

    res.json({
      token,
      username: user.username,
      role: user.role
    });

  } catch (err) {
    console.error("🔥 LOGIN ERROR:", err);  // 🔥 IMPORTANT
    res.status(500).json({ message: "Internal Server Error" });
  }
};
