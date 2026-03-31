exports.isAdmin = (req, res, next) => {
    if (req.role !== "admin") {
        return res.status(403).json({
            message: "Access denied. Admin only."
        });
    }
    console.log("Request Role:", req.role);
    next();
};