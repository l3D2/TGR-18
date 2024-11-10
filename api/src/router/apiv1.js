const express = require("express");
const db = require("../mongodb");
const model = require("../model/schema");
const multer = require("multer");
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "file1") {
      cb(null, "uploads/dest1");
    } else if (file.fieldname === "file2") {
      cb(null, "uploads/dest2");
    } else {
      cb(new Error("Unexpected field"), false); // Reject file
    }
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Set file name
  },
});

const upload = multer({ storage: storage });

router.post("/insertData", async (req, res) => {
  const { ts, d } = req.body;
  if (!ts || !d || !d.exp || !d.pred) {
    return res
      .status(400)
      .json({ message: "Missing required fields.", status: "Error" });
  }
  //   if (ts == null || d == null || d.exp == null || d.pred == null) {
  //     return res.status(400).json({ message: "Missing required fields.", status: "Error" });
  //   }
  console.log(ts, d);
  res.status(200).json({ message: "Data received.", status: "OK" });
  //   const data = new model.schema({ ts: ts, data: {exp: d.exp, } });
});

router.post("/upload", upload.array("files", 2), (req, res) => {
  const { ts, d } = req.body;

  // Check if required fields are provided
  if (!ts || !d) {
    return res.status(400).json({ error: "Both 'ts' and 'd' are required" });
  }

  // Check if files are provided
  if (!req.files || req.files.length < 2) {
    return res.status(400).json({ error: "At least two files are required" });
  }

  // Log file information
  console.log("Files:", req.files);

  // Continue with further processing
  res
    .status(200)
    .json({ message: "Files and data received successfully", data: { ts, d } });
});

module.exports = router;
