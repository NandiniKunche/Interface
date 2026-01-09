const express = require("express");
const router = express.Router();
const Doctor = require("../models/Doctor");

// ADD doctor
router.post("/", async (req, res) => {
  try {
    const doctor = new Doctor(req.body);
    await doctor.save();
    res.status(201).json({ doctor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// GET doctors
router.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

