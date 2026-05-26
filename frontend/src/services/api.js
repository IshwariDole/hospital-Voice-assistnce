export const sendMessageToAI = async (message) => {
  const res = await fetch(
    "https://hospital-voice-assistnce.onrender.com/chat",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    },
  );

  const data = await res.json();
  return data.reply;
};
