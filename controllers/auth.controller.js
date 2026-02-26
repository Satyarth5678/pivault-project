const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const users = [
    {
        id: 1,
        username: "admin",
        password: bcrypt.hashSync("admin123", 8),
        role: "admin"
    },
    {
        id: 2,
        username: "user",
        password: bcrypt.hashSync("user123", 8),
        role: "user"
    }
];

exports.login = (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username);
    if (!user) {
        return res.status(401).json({ message: "User not found" });
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
        return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.json({
        id: user.id,
        username: user.username,
        role: user.role,
        accessToken: token
    });
};