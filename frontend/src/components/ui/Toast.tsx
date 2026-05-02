import React from "react";

interface ToastProps {
  message: string;
  visible: boolean;
  type?: "error" | "success" | "info";
}

const TOAST_STYLES: Record<NonNullable<ToastProps["type"]>, React.CSSProperties> = {
  error:   { background: "#501313", borderLeft: "4px solid #E24B4A" },
  success: { background: "#173404", borderLeft: "4px solid #639922" },
  info:    { background: "#042C53", borderLeft: "4px solid #378ADD" },
};

const TOAST_ICON: Record<NonNullable<ToastProps["type"]>, string> = {
  error:   "✕",
  success: "✓",
  info:    "i",
};

const Toast: React.FC<ToastProps> = ({ message, visible, type = "error" }) => (
  <div
    role="alert"
    aria-live="assertive"
    style={{
      position: "fixed",
      bottom: 32,
      left: "50%",
      transform: `translateX(-50%) translateY(${visible ? 0 : 16}px)`,
      opacity: visible ? 1 : 0,
      transition: "opacity 0.25s ease, transform 0.25s ease",
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "10px 18px",
      borderRadius: 24,
      pointerEvents: "none",
      zIndex: 999,
      whiteSpace: "nowrap",
      color: "#fff",
      fontSize: 13,
      fontWeight: 500,
      boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
      ...TOAST_STYLES[type],
    }}
  >
    <span
      style={{
        width: 18, height: 18,
        borderRadius: "50%",
        background: "rgba(255,255,255,0.15)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 11, fontWeight: 700, flexShrink: 0,
      }}
    >
      {TOAST_ICON[type]}
    </span>
    {message}
  </div>
);

export default Toast;