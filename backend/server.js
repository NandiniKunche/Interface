// server.js
console.log("SERVER FILE STARTED");


const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();



// allow json body
app.use(express.json());

// allow requests from frontend
app.use(cors());

// connect to mongo
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected!"))
  .catch(err => console.error(err));

// test route
app.get("/", (req, res) => {
  res.send("Backend running");
});

// routes import
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

const patientRoutes = require("./routes/patientRoutes");
app.use("/api/patients", patientRoutes);

const visitRoutes = require("./routes/visitRoutes");
app.use("/api/visits", visitRoutes);

const doctorRoutes = require("./routes/doctorRoutes");
app.use("/api/doctors", doctorRoutes);


const prescriptionRoutes = require("./routes/prescriptionRoutes");
app.use("/api/prescriptions", prescriptionRoutes);


app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server on port " + PORT));
