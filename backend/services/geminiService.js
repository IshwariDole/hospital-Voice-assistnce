import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const askGemini = async (userMessage) => {
  const prompt = `
You are a polite hospital receptionist.
Help patients book appointments, ask symptoms, suggest departments.

Patient: ${userMessage}
Receptionist:
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
  });

  return response.text;
};