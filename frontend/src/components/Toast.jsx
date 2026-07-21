const CONFIG = {
  success: { bg: "#059669", icon: "✓", label: "Success" },
  error:   { bg: "#DC2626", icon: "✕", label: "Error"   },
  info:    { bg: "#1D6AE5", icon: "i", label: "Info"    },
};

export default function Toast({ message, type = "info" }) {
  const c = CONFIG[type] || CONFIG.info;
  return (
    <div
      className="toast-up"
      style={{
        position: "fixed",
        bottom: "calc(env(safe-area-inset-bottom) + 20px)",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "12px 20px",
        borderRadius: "100px",
        background: c.bg,
        color: "white",
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        fontSize: "14px",
        fontWeight: 600,
        boxShadow: "0 8px 32px rgba(0,0,0,0.20)",
        whiteSpace: "nowrap",
        maxWidth: "calc(100vw - 32px)",
      }}
    >
      <span style={{
        width: 20, height: 20, borderRadius: "50%",
        background: "rgba(255,255,255,0.25)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 11, fontWeight: 800, flexShrink: 0,
      }}>{c.icon}</span>
      <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{message}</span>
    </div>
  );
}
