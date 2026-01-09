
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Patient schema
const PatientSchema = new mongoose.Schema({
  patient_id: String,
  full_name: String,
  age: Number,
  gender: String,
  blood_group: String,
  phone_number: String,
  email: String,
  emergency_contact: String,
  hospital_location: String,
  bmi: Number,
  smoker_status: Boolean,
  alcohol_use: Boolean,
  chronic_conditions: [String],
  registration_date: String,
  insurance_type: String,
});

// Patient model
const Patient = mongoose.model("Patient", PatientSchema);

// ✅ GET http://localhost:5000/api/patients
router.get("/", async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: "Error fetching patients" });
  }
});

// ✅ POST http://localhost:5000/api/patients
router.post("/", async (req, res) => {
  try {
    const patient = new Patient(req.body);
    await patient.save();
    res.json({ message: "Patient saved", patient });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving patient" });
  }
});


router.post("/bulk", async (req, res) => {
  try {
    const patients = req.body;

    if (!Array.isArray(patients)) {
      return res.status(400).json({ message: "Expected array" });
    }

    await Patient.insertMany(patients, { ordered: false });

    res.status(201).json({ message: "Patients saved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save patients" });
  }
});


module.exports = router;
