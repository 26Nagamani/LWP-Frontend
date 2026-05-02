import React, { useState } from "react";
import type { OptionItem } from "../../../types/activity.types";

interface OptionsStepProps {
  image?: string;
  question: string;
  options: OptionItem[];
  correctId: string;
  explanation?: string;
  onCorrect: () => void;
  onWrong: () => void;
}

const OptionsStep: React.FC<OptionsStepProps> = ({
  image,
  question,
  options,
  correctId,
  explanation,
  onCorrect,
  onWrong,
}) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleSelect = (id: string) => {
    if (selected) return;
    if (id === correctId) {
      setSelected(id);
      setShowExplanation(true);
      onCorrect();
    } else {
      onWrong(); // toast only, no state change — user can retry
    }
  };

  return (
    <div className="bg-white rounded-2xl border w-full overflow-hidden">

      {/* static image — card resizes to image */}
      {image && (
        <img
          src={image}
          alt="step visual"
          className="w-full object-contain"
        />
      )}

      {/* question */}
      <div className="p-6 border-t">
        <p className="font-semibold text-gray-800 mb-4">{question}</p>

        {/* options — 2 per row */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {options.map((opt) => {
            const id = opt["@_id"];
            const isSelected = selected === id;
            const isCorrect = id === correctId;

            let classes = "flex items-start gap-3 p-3 border rounded-xl text-sm text-left cursor-pointer transition-colors ";

            if (isSelected && isCorrect) {
              classes += "bg-green-50 border-green-600 text-green-800";
            } else {
              classes += "hover:bg-gray-50 border-gray-200 text-gray-700";
            }

            return (
              <button
                key={id}
                onClick={() => handleSelect(id)}
                className={classes}
                disabled={!!selected}
              >
                <span className="min-w-[22px] h-[22px] rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                  {id}
                </span>
                <span>{opt["#text"]}</span>
              </button>
            );
          })}
        </div>

        {/* explanation — only shown on correct answer */}
        {showExplanation && (
          <p className="text-sm text-gray-600 mt-2">{explanation}</p>
        )}
      </div>
    </div>
  );
};

export default OptionsStep;