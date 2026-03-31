const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];

    console.log("AUTH HEADER:", authHeader); // ✅ MOVED UP

    if (!authHeader) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "SECRET_KEY");

        console.log("DECODED:", decoded); // ✅ DEBUG

        req.user = decoded;
        next();
    } catch (err) {
        console.log("JWT ERROR:", err.message); // ✅ DEBUG
        return res.status(403).json({ message: "Invalid token" });
    }
};