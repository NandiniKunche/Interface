const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Visit Schema
const VisitSchema = new mongoose.Schema({
  visit_id: { type: String, required: true, unique: true },

  patient_id: { type: String, required: true },
  doctor_id: { type: String, required: true },

  visit_date: { type: String, required: true },

  severity_score: { type: Number, min: 0, max: 5 },
  visit_type: { type: String, enum: ["OP", "IP"], default: "OP" },

  length_of_stay: { type: Number, default: 0 },

  lab_result_glucose: { type: Number },
  lab_result_bp: { type: String },

  previous_visit_gap_days: { type: Number, default: 0 },
  readmitted_within_30_days: { type: Boolean, default: false },

  visit_cost: { type: Number, required: true }
});

// Visit Model
const Visit = mongoose.model("Visit", VisitSchema);

// ✅ GET all visits
router.get("/", async (req, res) => {
  try {
    const visits = await Visit.find();
    res.json(visits);
  } catch (err) {
    res.status(500).json({ message: "Error fetching visits" });
  }
});

// ✅ POST add visit
router.post("/", async (req, res) => {
  try {
    const visit = new Visit(req.body);
    await visit.save();
    res.json({ message: "Visit saved", visit });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving visit" });
  }
});


router.post("/bulk", async (req, res) => {
  try {
    const visits = req.body;

    if (!Array.isArray(visits)) {
      return res.status(400).json({ message: "Expected array" });
    }

    await Visit.insertMany(visits, { ordered: false });

    res.status(201).json({ message: "Visits saved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save visits" });
  }
});


module.exports = router;

