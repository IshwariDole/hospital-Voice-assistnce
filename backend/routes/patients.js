import express from "express";
import Patient from "../models/Patient.js";

const router = express.Router();

// POST /api/patients
router.post("/", async (req, res) => {
  try {
    const newPatient = new Patient(req.body);
    await newPatient.save();

    res.status(201).json({ message: "Patient saved successfully" });
  } catch (error) {
    console.error("Patient Save Error:", error);
    res.status(500).json({ message: "Error saving patient" });
  }
});

export default router;