import { askGemini } from "../services/geminiService.js";

export const chatWithAI = async (req, res) => {
  try {
    const userMessage = req.body.message;

    const reply = await askGemini(userMessage);

    res.json({ reply });
  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).json({
      reply: "Sorry, AI is not available right now.",
    });
  }
};