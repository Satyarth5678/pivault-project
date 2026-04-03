const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.BASE_PATH + "/users");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Upload route
router.post("/", upload.single("file"), (req, res) => {
  res.json({
    message: "File uploaded successfully",
    file: req.file,
  });
});

module.exports = router;
