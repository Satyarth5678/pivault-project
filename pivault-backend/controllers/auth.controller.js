const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");

const USERS_FILE = path.join(__dirname, "../data/users.json");

const readUsers = () => {
    return JSON.parse(fs.readFileSync(USERS_FILE));
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    const users = readUsers();
    const user = users.find((u) => u.username === username);

    if (!user) {
        return res.status(401).json({ message: "Invalid username" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
        { username: user.username, role: user.role },
        process.env.JWT_SECRET || "SECRET_KEY",
        { expiresIn: "1d" }
    );

    res.json({
        token,
        username: user.username,
        role: user.role
    });
    console.log("USERS FILE PATH:", USERS_FILE);

};