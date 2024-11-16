const express = require("express");
const db = require("../mongodb");
const model = require("../model/schema");
const multer = require("multer");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser"); // import body-parser
const router = express.Router();

require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});

// Configure body-parser to handle JSON
router.use(bodyParser.json()); // Apply body-parser only for JSON

function validateJWT(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(403).json({ message: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err)
      if (err.name === "TokenExpiredError")
        return res.status(401).json({ message: "Token expired" });
      else return res.status(401).json({ message: "Unauthorized" });
    req.user = decoded;
    next();
  });
}

function createJWT(user, pass) {
  return jwt.sign({ username: user, password: pass }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

function validateFiles(req, res, next) {
  if (req.files) {
    if (req.files.file1 && req.files.file1.length > 1) {
      return res
        .status(400)
        .json({ error: "Only one file allowed for 'file1'" });
    }

    if (req.files.input && req.files.input.length > 1) {
      return res
        .status(400)
        .json({ error: "Only one file allowed for 'input'" });
    }
  }

  // Proceed to the next middleware (multer)
  next();
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dir;

    if (file.fieldname === "file1") {
      dir = "/var/www/html/uploads/sound";
    } else if (file.fieldname === "input") {
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
    // ใช้เวลาปัจจุบันเป็นชื่อไฟล์ หากไม่มี Timestamp ใน req.body
    const timestamp = req.body?.timestamp || Date.now();
    if (file.fieldname === "file1")
      cb(null, `${timestamp}_${file.originalname}`);
    else if (file.fieldname === "input") cb(null, `${file.originalname}`);
    else cb(new Error("Unexpected field"));
  },
});

module.exports = multer({ storage });

// Apply multer and field checks
const upload = multer({ storage: storage });

router.post("/getToken", (req, res) => {
  const body = req.body;
  console.log(body);
  if (
    body.user == process.env.JWT_Username &&
    body.pass == process.env.JWT_Password
  ) {
    const token = createJWT(body.user, body.pass);
    res.json({ token }).status(200);
  } else
    res.status(404).json({ message: "Invalid Authentication", status: 404 });
});

router.post(
  "/upload",
  validateJWT,
  validateFiles, // Custom validation middleware before multer processes the files
  upload.fields([{ name: "file1", maxCount: 1 }]),
  async (req, res) => {
    const body = req.body.json_data;
    const data = JSON.parse(body);
    console.log(data);
    if (!req.files || !req.files.file1) {
      return res.status(400).json({ error: "file is required" });
    }
    await db.connect();
    try {
      const newData = new model.schema({
        ts: data.Timestamp,
        predict: data.Perdict,
        feature: data.Feature,
        conf: data.conf,
        file: req.files.file1[0].filename,
      });
      const result = await newData.save();
      console.log("Data saved to MongoDB:");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
    } finally {
      await db.disconnect();
    }
    res.status(200).json({ message: "received" });
  }
);

router.post(
  "/uploadInput",
  validateFiles, // Custom validation middleware before multer processes the files
  upload.fields([{ name: "input", maxCount: 1 }]),
  async (req, res) => {
    if (!req.files || !req.files.input) {
      return res.status(400).json({ error: "file is required" });
    }
    res.status(200).json({ message: "received" });
  }
);

router.post("/predict", validateJWT, async (req, res) => {
  const body = req.body;
  console.log(body);
  await db.connect();
  try {
    const newData = new model.schemaSound({
      ts: Math.floor(body.Timestamp / 1000),
      audioPos: body.AudioPosition,
      sound: body.sound,
    });
    const result = await newData.save();
    res.status(200).json({ message: "Data received.", status: "OK" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  } finally {
    await db.disconnect();
  }
});

router.get("/test", validateJWT, (req, res) => {
  res.status(200).json({ message: "API Running.", status: "OK" });
});

router.get("/getSound", async (req, res) => {
  await db.connect();
  try {
    const data = await model.schemaSound.find();
    console.log(data);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  } finally {
    await db.disconnect();
  }
});

module.exports = router;
