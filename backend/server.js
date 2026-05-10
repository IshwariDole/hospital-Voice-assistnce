import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { appointments } from "./data/appointments.js";
import { doctors, emergencyKeywords } from "./data/hospitalData.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

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


// 📅 Final appointment booking API
app.post("/book-appointment", (req, res) => {
  const { name, department, time } = req.body;

  if (!name || !department || !time) {
    return res.status(400).json({ message: "All fields required" });
  }

  const newAppointment = {
    id: Date.now(),
    name,
    department,
    time,
    date: new Date().toLocaleString()
  };

  appointments.push(newAppointment);

  res.json({
    message: "Appointment booked successfully",
    appointment: newAppointment
  });
});

app.listen(5000, () => console.log("Server running on port 5000"));