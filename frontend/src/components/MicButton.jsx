import { startListening } from "../services/speechToText";

export default function MicButton({ onSpeech }) {
  const handleClick = () => {
    startListening((text) => {
      onSpeech(text);
    });
  };

  return (
    <button
      onClick={handleClick}
      className="bg-red-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-red-600"
    >
      🎤 Speak
    </button>
  );
}