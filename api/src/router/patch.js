const express = require("express");
const db = require("../mongodb");
const model = require("../model/schema");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const router = express.Router();
require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dir;

    if (file.fieldname === "filepatch") {
      dir = "/var/www/html/uploads/patch";
    } else {
      return cb(new Error("Unexpected field"), false); // Reject file if the field is unexpected
    }

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`); // Set file name
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === ".zip") {
      cb(null, true); // Accept file
    } else {
      cb(new Error("Only .zip files are allowed!"), false); // Reject file
    }
  },
});

// Validation middleware to check for files
const validateFiles = (req, res, next) => {
  console.log("Files received:", req.files); // Log received files for debugging
  if (!req.files || !req.files.filepatch || req.files.filepatch.length === 0) {
    return res
      .status(400)
      .json({ error: "At least one .zip file is required" });
  }
  next();
};

const directoryPath = "/var/www/html/uploads/patch"; // Path to the directory

// API to list all files with sizes
router.get("/getPatches", async (req, res) => {
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return res.status(500).json({ error: "Failed to read directory" });
    }

    const fileList = files
      .filter((file) => fs.statSync(path.join(directoryPath, file)).isFile())
      .map((file) => {
        const filePath = path.join(directoryPath, file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          size: stats.size, // File size in bytes
        };
      });

    res.json({ files: fileList });
  });
});

// Route to handle .zip file uploads
router.post(
  "/uploadPatch",
  upload.fields([{ name: "filepatch", maxCount: 10 }]), // Allow up to 10 .zip files
  validateFiles,
  async (req, res) => {
    if (!req.files || !req.files.filepatch) {
      return res.status(400).json({ error: ".zip file is required" });
    }
    // Retrieve uploaded file information
    const uploadedFiles = req.files.filepatch.map((file) => ({
      filename: file.filename,
      path: file.path,
      size: file.size,
    }));

    res.status(200).json({
      message: ".zip files received",
      files: uploadedFiles,
    });
  }
);

module.exports = router;
