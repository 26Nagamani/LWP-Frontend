import React, { useEffect, useState } from "react";

interface InteractiveStepProps {
  src: string;
  question: string;
  explanation?: string;
  onNext: () => void;
}

const InteractiveStep: React.FC<InteractiveStepProps> = ({ src, question, explanation, onNext }) => {
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    setHtmlContent(null);
    setError(false);
    setShowExplanation(false);

    fetch(src)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.text();
      })
      .then((html) => setHtmlContent(html))
      .catch(() => setError(true));
  }, [src]);

  return (
    <div className="bg-white rounded-2xl border w-full overflow-hidden">

      {/* iframe — resizes to content */}
      {error && (
        <div className="p-4 text-red-600 text-sm">Failed to load interactive content.</div>
      )}

      {!error && !htmlContent && (
        <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
          Loading...
        </div>
      )}

      {htmlContent && (
        <iframe
          srcDoc={htmlContent}
          title="interactive activity"
          width="100%"
          style={{ border: "none", display: "block", height: "550px" }}
          sandbox="allow-scripts allow-downloads"
        />
      )}

      {/* question + explanation */}
      <div className="p-6 border-t">
        <p className="font-semibold text-gray-800 mb-4">{question}</p>

        {showExplanation ? (
          <p className="text-sm text-gray-600">{explanation}</p>
        ) : (
          <button
            onClick={() => setShowExplanation(true)}
            className="text-indigo-700 text-sm font-medium"
          >
            Show Explanation
          </button>
        )}
      </div>

      {/* next button — bottom right */}
      <div className="px-6 pb-6 flex justify-end">
        <button
          onClick={onNext}
          disabled={!htmlContent}
          className="border rounded-lg px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default InteractiveStep; 