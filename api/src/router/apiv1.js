const express = require("express");
const db = require("../mongodb");
const model = require("../model/schema");
const multer = require("multer");
const fs = require("fs");
const router = express.Router();

// Custom middleware to validate files before multer processes them
function validateFiles(req, res, next) {
  if (req.files) {
    if (req.files.file1 && req.files.file1.length > 1) {
      return res
        .status(400)
        .json({ error: "Only one file allowed for 'file1'" });
    }

    if (req.files.file2 && req.files.file2.length > 1) {
      return res
        .status(400)
        .json({ error: "Only one file allowed for 'file2'" });
    }
  }

  // Proceed to the next middleware (multer)
  next();
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dir;

    if (file.fieldname === "file1") {
      dir = "uploads/original";
    } else if (file.fieldname === "file2") {
      dir = "uploads/filtered";
    } else {
      return cb(new Error("Unexpected field"), false); // Reject file if the field is unexpected
    }

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${req.body.timestamp}-${file.originalname}`); // Set file name
  },
});

// Apply multer and field checks
const upload = multer({ storage: storage });

router.post("/insertData", async (req, res) => {
  const { ts, d } = req.body;
  if (!ts || !d || !d.exp || !d.pred) {
    return res
      .status(400)
      .json({ message: "Missing required fields.", status: "Error" });
  }
  console.log(ts, d);
  res.status(200).json({ message: "Data received.", status: "OK" });
  //   const data = new model.schema({ ts: ts, data: {exp: d.exp, } });
});

router.post(
  "/upload",
  validateFiles, // Custom validation middleware before multer processes the files
  upload.fields([
    { name: "file1", maxCount: 1 },
    { name: "file2", maxCount: 1 },
  ]),
  async (req, res) => {
    // const ts = parseInt(req.body.ts);
    // const d = JSON.parse(req.body.d);

    // // Check if required fields are provided
    // if (!ts || !d) {
    //   return res.status(400).json({ error: "Both 'ts' and 'd' are required" });
    // }

    if (!req.files || !req.files.file1 || !req.files.file2) {
      return res
        .status(400)
        .json({ error: "Both file1 and file2 are required" });
    }
    console.log(req.body.timestamp);
    res.status(200).json({ message: "received" });
    // await db.connect();
    // try {
    //   const newData = new model.schema({
    //     ts: ts,
    //     data: {
    //       exp: d.exp,
    //       mch_status: d.mch_status,
    //       pred: d.pred,
    //     },
    //     files: {
    //       original: req.files.file1[0].path,
    //       filtered: req.files.file2[0].path,
    //     },
    //   });
    //   const result = await newData.save();
    //   // Send response after saving the data
    //   res.status(201).json(result);
    // } catch (error) {
    //   res.status(500).json({ message: error.message });
    // } finally {
    //   // Ensure database disconnect regardless of success or failure
    //   await db.disconnect();
    // }
  }
);

module.exports = router;
