import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import { useLocation } from "react-router-dom";

import {
  getVisual,
  generateVisual,
} from "../../../utils/api/activity.api";

import ActivityTypeModal from "../activityType/ActivityTypeModal";

interface ActivityVisual {
  topic_id: string;
  topic_name: string;
  activity_id: string;
  step_number: number;
  image_url?: string;
  audio_url?: string;
  speak_line?: string;
  question: {
    question: string;
    options: Record<string, string> | string;
    correct_answer: string;
    explanation: string;
  };
}

export default function ActivityPreviewPage() {
  const { topicId, stepNumber, mode } = useParams();
  const navigate = useNavigate();
  const step = Number(stepNumber);

  const [visual, setVisual] = useState<ActivityVisual | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [generating, setGenerating] = useState(false);

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [wrongAnswer, setWrongAnswer] = useState<string | null>(null);
  const [showExplanationBtn, setShowExplanationBtn] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  // NEXT STEP MODAL
  const [nextStepNotFound, setNextStepNotFound] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);

  const explanationRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const stateData = location.state?.data;

  const is404 = (err: any) =>
    err?.status === 404 ||
    err?.message?.includes("404") ||
    err?.message?.toLowerCase().includes("not found");

  const parseVisual = (data: any): ActivityVisual => {
    if (typeof data?.question?.options === "string") {
      data.question.options = JSON.parse(data.question.options);
    }
    return data;
  };

  // REDIRECT IF INTERACTIVE MODE
  useEffect(() => {
    if (mode === "interactive") {
      navigate(`/admin/activity/${topicId}/${stepNumber}/interactive`, { replace: true });
    }
  }, [mode]);

  /* ---------------- FETCH ---------------- */
  const fetchVisual = async () => {
    if (!topicId) return;

    try {
      setLoading(true);
      setNotFound(false);

      const data = await getVisual(topicId, step);
      setVisual(parseVisual(data));
    } catch (err: any) {
      if (is404(err)) {
        setVisual(null);
        setNotFound(true);
      } else {
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  if (stateData) {
    setVisual(parseVisual(stateData));
    setLoading(false);
    return;
  }

  // fallback (refresh case)
  fetchVisual();
}, [step]);

  /* ---------------- GENERATE (current step) ---------------- */
  const handleGenerate = async () => {
    if (!topicId) return;

    try {
      setGenerating(true);
      await generateVisual(topicId, step, mode ?? "options");
      await fetchVisual();
      toast.success("Activity generated");
    } catch (err) {
      toast.error("Failed to generate");
    } finally {
      setGenerating(false);
    }
  };

  /* ---------------- ANSWER ---------------- */
  const handleAnswerClick = (key: string) => {
    if (!visual) return;

    const correct = visual.question.correct_answer;

    if (key !== correct) {
      setWrongAnswer(key);
      toast.error("Wrong answer. Try again!");
      return;
    }

    setSelectedAnswer(key);
    setWrongAnswer(null);
    setShowExplanationBtn(true);

    setTimeout(() => {
      explanationRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  /* ---------------- NEXT ---------------- */
  const handleNext = async () => {
    const nextStep = step + 1;
    if (!topicId) return;

    try {
      await getVisual(topicId, nextStep);
      navigate(`/admin/activity/${topicId}/${nextStep}/${mode}`);
    } catch (err: any) {
      if (is404(err)) {
        setNextStepNotFound(true);
      }
    }
  };
  const cleanUrl = (url?: string) => {
    if (!url) return "";
    return url.replace(/%22/g, "").replace(/"/g, "").trim();
  };
  

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

      {/* BACK */}
      <div className="p-6">
        <button
          onClick={() => navigate(`/admin/activity/${topicId}`)}
          className="border px-4 py-2 rounded-lg hover:bg-gray-50 text-sm"
        >
          ← Back
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-6 p-6">

        {/* LOADING */}
        {loading ? (
          <div className="bg-white rounded-2xl border w-full max-w-3xl h-[420px] animate-pulse" />

        ) : notFound ? (
          <div className="flex flex-col items-center gap-4">
            <p className="text-gray-500">No activity found for this step</p>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg"
            >
              {generating ? "Generating..." : "Generate Activity"}
            </button>
          </div>

        ) : visual && (
          <>
            {/* CARD */}
            <div className="bg-white rounded-2xl border p-6 w-full max-w-3xl h-[420px] flex flex-col">

              {/* IMAGE */}
              <div className="bg-gray-50 rounded-xl flex items-center justify-center p-2 mb-3 h-[160px]">
                {visual.image_url ? (
                  <img
                    src={visual.image_url}
                    className="max-h-full w-full object-contain"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">No visual available</span>
                )}
              </div>

              {visual.audio_url && (
                  <div className="bg-gray-100 rounded-lg p-3 mb-3">
                    <div className="text-xs font-semibold uppercase opacity-60 mb-1">
                      Audio Explanation
                    </div>

                    <audio controls className="w-full mb-2">
                      <source
                        src={cleanUrl(visual.audio_url)}
                        type="audio/mpeg"
                      />
                      Your browser does not support the audio element.
                    </audio>

                    {visual.speak_line && (
                      <p className="text-sm italic text-gray-600">
                        “{visual.speak_line}”
                      </p>
                    )}
                  </div>
                )}
              {/* QUESTION */}
              <p className="font-semibold mb-3">{visual.question.question}</p>

              {/* OPTIONS */}
              <div className="grid grid-cols-2 gap-3 flex-1 overflow-y-auto">
                {Object.entries(visual.question.options).map(([key, val]) => {
                  const isCorrect = key === visual.question.correct_answer;
                  const isWrong = key === wrongAnswer;

                  return (
                    <button
                      key={key}
                      onClick={() => handleAnswerClick(key)}
                      className={`p-3 rounded-xl border text-sm text-left
                        ${
                          selectedAnswer
                            ? isCorrect
                              ? "bg-green-100 border-green-400"
                              : "opacity-60"
                            : isWrong
                            ? "bg-red-100 border-red-400"
                            : "hover:bg-gray-50"
                        }`}
                    >
                      <span className="mr-2 font-medium">{key}.</span>
                      {val as string}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ACTIONS */}
            {showExplanationBtn && (
              <div ref={explanationRef} className="flex items-center gap-6">
                <button
                  onClick={() => setOpenModal(true)}
                  className="text-indigo-800 font-medium"
                >
                  Show Explanation
                </button>

                {/* NEXT OR GENERATE FOR NEXT STEP */}
                {nextStepNotFound ? (
                  <button
                    onClick={() => setIsActivityModalOpen(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Generate Next
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="text-indigo-800 font-medium"
                  >
                    Next →
                  </button>
                )}
              </div>
            )}

            {/* EXPLANATION MODAL */}
            {openModal && (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 w-full max-w-lg relative">
                  <button
                    onClick={() => setOpenModal(false)}
                    className="absolute top-3 right-3 text-gray-500"
                  >
                    <X size={18} />
                  </button>
                  <h3 className="font-semibold mb-3">Explanation</h3>
                  <p className="text-sm text-gray-600">{visual.question.explanation}</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ACTIVITY TYPE MODAL FOR NEXT STEP */}
      {topicId && (
        <ActivityTypeModal
          isOpen={isActivityModalOpen}
          onClose={() => setIsActivityModalOpen(false)}
          topicId={topicId}
          stepNumber={step + 1}
        />
      )}
    </div>
  );
}