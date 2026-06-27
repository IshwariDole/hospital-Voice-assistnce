const icons = { success: "✅", error: "❌", info: "ℹ️" };
const colors = {
  success: "bg-green-500",
  error:   "bg-red-500",
  info:    "bg-blue-500",
};

export default function Toast({ message, type = "info" }) {
  return (
    <div
      className={`fixed bottom-6 right-4 left-4 md:left-auto md:w-auto z-[200]
        ${colors[type]} text-white px-5 py-3 rounded-2xl shadow-2xl
        flex items-center gap-3 text-sm font-medium toast-slide`}
    >
      <span className="text-base">{icons[type]}</span>
      <span>{message}</span>
    </div>
  );
}
