import React from "react";

interface QuestionRendererProps {
  text: string;
}

const QuestionRenderer: React.FC<QuestionRendererProps> = ({ text }) => (
  <p
    style={{
      fontSize: 15,
      fontWeight: 500,
      padding: "14px 18px 10px",
      lineHeight: 1.5,
      color: "var(--color-text-primary, #111)",
      margin: 0,
    }}
  >
    {text}
  </p>
);

export default QuestionRenderer;