import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  name: String,
  department: String,
  time: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Appointment", appointmentSchema);