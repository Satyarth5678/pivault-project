const jwt = require("jsonwebtoken");

const SECRET =  "pivault-secret";

exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];

    console.log("AUTH HEADER:", authHeader);

    // 🔴 No header
    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }

    // 🔴 Invalid format check
    if (!authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Malformed token" });
    }

    const token = authHeader.split(" ")[1];

    // 🔴 Missing token after split
    if (!token) {
        return res.status(401).json({ message: "Token missing" });
    }

    try {
        const decoded = jwt.verify(token, SECRET);

        console.log("DECODED:", decoded);

        req.user = decoded;
        next();
    } catch (err) {
        console.log("JWT ERROR:", err.message);

        if (err.name === "TokenExpiredError") {
            return res.status(403).json({ message: "Token expired" });
        }

        return res.status(403).json({ message: "Invalid token" });
    }
};
