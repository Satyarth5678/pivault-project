const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth.middleware");
const userController = require("../controllers/user.controller");

// ✅ PROTECT ROUTES
router.get("/", verifyToken, userController.getUsers);
router.post("/create", verifyToken, userController.createUser);
router.delete("/", verifyToken, userController.deleteUser);

module.exports = router;
