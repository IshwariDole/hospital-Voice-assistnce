import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  name: String,
  age: String,
  gender: String,
  department: String,
  phone: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Patient", patientSchema);