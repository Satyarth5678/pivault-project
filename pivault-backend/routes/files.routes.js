const express = require("express");
const router = express.Router();
const multer = require("multer");
const { verifyToken } = require("../middlewares/auth.middleware");
const fileController = require("../controllers/file.controller");

// 🔥 MEMORY STORAGE (IMPORTANT)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// =============================
// ROUTES
// =============================
router.get("/", verifyToken, fileController.getFiles);
router.delete("/delete", verifyToken, fileController.deleteFile);
router.get("/usage", verifyToken, fileController.getStorageUsage);
router.get("/download", verifyToken, fileController.downloadFile);

// 🔥 UPLOAD ROUTE (VERY IMPORTANT)
router.post("/upload", verifyToken, upload.single("file"), fileController.uploadFile);
module.exports = router;