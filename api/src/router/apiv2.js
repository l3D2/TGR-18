const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const directoryPath = "/var/www/html/uploads/sound"; // Path to the directory

// API to list all files with sizes
router.get("/soundAll", async (req, res) => {
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

// API to download a specific file
router.get("/download/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(directoryPath, filename);

  // Check if file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error("File not found:", filename);
      return res.status(404).json({ error: "File not found" });
    }

    // Send file to client
    res.download(filePath, filename, (err) => {
      if (err) {
        console.error("Error sending file:", err);
        res.status(500).json({ error: "Error downloading file" });
      }
    });
  });
});

module.exports = router;
