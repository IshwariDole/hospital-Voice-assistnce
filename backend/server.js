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

    // 🚨 Emergency detection
    if (emergencyKeywords.some(word => userMessage.includes(word))) {
      return res.json({
        reply:
          "🚨 This sounds like an emergency. Please call 108 immediately or visit the nearest hospital!"
      });
    }

    // 👨‍⚕️ Doctor list
    if (userMessage.includes("doctor") || userMessage.includes("department")) {
      let docList = doctors
        .map(doc => `${doc.name} - ${doc.department} (${doc.time})`)
        .join("\n");

      return res.json({
        reply: "Here are our available doctors:\n\n" + docList
      });
    }

    // 📅 Appointment booking start
    if (userMessage.includes("appointment") || userMessage.includes("book")) {
      return res.json({
        reply:
          "Sure 😊 Please tell me:\n• Your name\n• Department\n• Preferred time"
      });
    }

    // 🤖 AI fallback (OpenRouter)
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openrouter/auto",
        messages: [
          {
            role: "system",
            content: `
You are an AI hospital receptionist.
Ask symptoms, suggest department, and help book appointments.
Reply in short helpful sentences.
`
          },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "No reply";

    res.json({ reply });

  } catch (err) {
    console.log(err);
    res.status(500).json({ reply: "AI error" });
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