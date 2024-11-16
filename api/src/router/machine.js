const express = require("express");
const db = require("../mongodb");
const model = require("../model/schema"); // อ้างถึงโมเดลของ MongoDB
const router = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});

// อ่านข้อมูลทั้งหมด (GET)
router.get("/fetch", async (req, res) => {
  await db.connect();
  try {
    const data = await model.machineSchema.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  } finally {
    await db.disconnect();
  }
});

// อัปเดตข้อมูล (PUT)
router.put("/update/:id", async (req, res) => {
  console.log("Request Body:", req.body); // Log the body to check the data

  await db.connect(); // Connect to the database
  try {
    // Ensure only the fields present in the request body are updated
    const updatedData = await model.machineSchema.findByIdAndUpdate(
      req.params.id, // The ID from the URL
      { $set: req.body }, // Use $set to update only the specified fields
      { new: true } // Return the updated document
    );

    if (!updatedData) {
      return res.status(404).json({ message: "Data not found" });
    }

    // Respond with the updated data
    res.json(updatedData);
  } catch (error) {
    // Handle errors
    console.error("Error updating data:", error);
    res.status(400).json({ message: error.message });
  } finally {
    // Disconnect from the database
    await db.disconnect();
  }
});

// ลบข้อมูล (DELETE)
router.delete("/delete/:id", async (req, res) => {
  await db.connect();
  try {
    const deletedData = await model.machineSchema.findByIdAndDelete(
      req.params.id
    );
    if (!deletedData) {
      return res.status(404).json({ message: "Data not found" });
    }
    res.json({ message: "Data deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  } finally {
    await db.disconnect();
  }
});

module.exports = router;
