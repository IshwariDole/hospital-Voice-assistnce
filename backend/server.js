import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { appointments } from "./data/appointments.js";
import { doctors, emergencyKeywords } from "./data/hospitalData.js";
import connectDB from "./config/db.js";
import Appointment from "./models/Appointment.js";
dotenv.config();
const app = express();
connectDB();
app.use(cors());
app.use(express.json());
import patientRoutes from "./routes/patients.js";

app.use("/api/patients", patientRoutes);

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message.toLowerCase();

    // 🚨 Emergency Detection
    if (
      userMessage.includes("emergency") ||
      userMessage.includes("chest pain") ||
      userMessage.includes("accident") ||
      userMessage.includes("heart attack")
    ) {
      return res.json({
        reply:
          "🚨 This sounds like an emergency. Please call 108 immediately or visit the nearest hospital."
      });
    }

    // 👨‍⚕️ Department Detection
    const departments = [
      "cardiologist",
      "dermatologist",
      "orthopedic",
      "pediatrician",
      "neurologist",
      "general physician"
    ];

    // ⏰ Time Detection
    const timeRegex = /\b([1-9]|1[0-2])\s?(am|pm)\b/i;

    // 👤 Name, Department, Time Extraction
    const parts = req.body.message.split(",");

    let patientName = "";
    let department = "";
    let preferredTime = "";

    if (parts.length >= 1) {
      patientName = parts[0].trim();
    }

    if (parts.length >= 2) {
      department = parts[1].trim();
    }

    if (parts.length >= 3) {
      preferredTime = parts[2].trim();
    }

    // 📅 Booking Intent
    // 📅 Appointment booking
if (
  userMessage.includes("appointment") ||
  userMessage.includes("book")
) {
  return res.json({
    reply:
      "Sure 😊 Please provide:\n\n👤 Patient Name\n🏥 Department\n⏰ Preferred Time"
  });
}

// 👨‍⚕️ Detect direct booking details
if (
  userMessage.includes(",")
) {
  return res.json({
    reply:
      "✅ Details received.\nPlease fill the appointment form on the right side to confirm booking."
  });
}

    // ✅ If all details provided
    const validDepartment = departments.some((d) =>
      department.toLowerCase().includes(d)
    );

    const validTime = timeRegex.test(preferredTime);

    if (patientName && validDepartment && validTime) {
      return res.json({
        reply: `Thanks ${patientName} 😊\nWhat symptoms are you experiencing?\nPlease also share your preferred date and contact number for booking.`
      });
    }

    // 🤖 AI RESPONSE (fallback)
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openrouter/auto",
          messages: [
            {
              role: "system",
              content: `
You are an AI hospital receptionist.

Rules:
- Keep replies short.
- Never assume patient name is doctor name.
- Ask only necessary questions.
- Be professional and friendly.
`
            },
            {
              role: "user",
              content: req.body.message
            }
          ]
        })
      }
    );

    const data = await response.json();

    const reply =
      data.choices?.[0]?.message?.content ||
      "Sorry, I couldn't understand.";

    res.json({ reply });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      reply: "Server error 😢"
    });
  }
});


app.post("/book-appointment", async (req, res) => {
  try {
    const { name, department, time } = req.body;

    if (!name || !department || !time) {
      return res.status(400).json({ message: "All fields required" });
    }

    const newAppointment = await Appointment.create({
      name,
      department,
      time
    });

    res.json({
      message: "Appointment booked successfully 🎉",
      appointment: newAppointment
    });

  } catch (error) {
    res.status(500).json({ message: "DB error" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));