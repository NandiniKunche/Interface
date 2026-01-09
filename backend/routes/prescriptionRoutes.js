
const express = require("express");
const router = express.Router();
const Prescription = require("../models/Prescription");

// ✅ GET all prescriptions
router.get("/", async (req, res) => {
  try {
    const prescriptions = await Prescription.find();
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ message: "Error fetching prescriptions" });
  }
});

// ✅ POST add prescription
router.post("/", async (req, res) => {
  try {
    const prescription = new Prescription(req.body);
    await prescription.save();
    res.json({ message: "Prescription saved", prescription });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving prescription" });
  }
});

module.exports = router;
