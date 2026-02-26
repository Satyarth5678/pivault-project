const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        return res.status(403).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
        return res.status(403).json({ message: "Invalid token format" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        req.userId = decoded.id;
        req.role = decoded.role;
        console.log("Decoded Role:", decoded.role);
        next();
    });
};