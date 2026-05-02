import React from "react";

interface ExplanationRendererProps {
  text: string;
}

const ExplanationRenderer: React.FC<ExplanationRendererProps> = ({ text }) => (
  <div
    style={{
      margin: "0 18px 16px",
      padding: "12px 14px",
      background: "var(--color-background-secondary, #f5f5f5)",
      borderLeft: "3px solid #378ADD",
      borderRadius: 6,
      fontSize: 13,
      color: "var(--color-text-secondary, #555)",
      lineHeight: 1.6,
    }}
  >
    <div
      style={{
        fontSize: 11,
        fontWeight: 600,
        marginBottom: 4,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        opacity: 0.6,
      }}
    >
      Explanation
    </div>
    {text}
  </div>
);

export default ExplanationRenderer;