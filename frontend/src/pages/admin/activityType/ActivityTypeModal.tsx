import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  generateVisual,
  generateInteractiveVisual,
} from "../../../utils/api/activity.api";

type ActivityType = "interactive" | "options";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  topicId: string;
  stepNumber: number;
}

export default function ActivityTypeModal({
  isOpen,
  onClose,
  topicId,
  stepNumber,
}: Props) {
  const [selected, setSelected] = useState<ActivityType>("options");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleGenerate = async () => {
    try {
      setLoading(true);

      if (selected === "interactive") {
        await generateInteractiveVisual(topicId, stepNumber, selected);
      } else {
        await generateVisual(topicId, stepNumber, selected);
      }

      navigate(`/admin/activity/${topicId}/${stepNumber}/${selected}`);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* BACKDROP */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow p-8 w-[480px] z-10">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-lg leading-none"
        >
          ✕
        </button>

        {/* TITLE */}
        <h2 className="text-lg font-semibold mb-6">Select Activity Type</h2>

        {/* TYPE TOGGLE */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setSelected("interactive")}
            className={`px-6 py-2 rounded-full border transition-colors ${
              selected === "interactive"
                ? "border-blue-500 text-blue-600 font-bold"
                : "border-gray-300 text-gray-500 font-normal"
            }`}
          >
            Interactive
          </button>

          <button
            onClick={() => setSelected("options")}
            className={`px-6 py-2 rounded-full border transition-colors ${
              selected === "options"
                ? "border-blue-500 text-blue-600 font-bold"
                : "border-gray-300 text-gray-500 font-normal"
            }`}
          >
            Quiz
          </button>
        </div>

        {/* GENERATE */}
        <div className="flex justify-center">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg disabled:opacity-60"
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>
      </div>
    </div>
  );
}