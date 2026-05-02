import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  getInteractiveVisual,
  generateInteractiveVisual,
} from "../../../utils/api/activity.api";

import ActivityTypeModal from "../activityType/ActivityTypeModal";

interface InteractiveVisual {
  topic_id: string;
  topic_name: string;
  activity_id: string;
  step_number: number;
  image_url: string;
  question: {
    question: string;
    correct_answer: string;
    explanation: string;
  };
}

export default function InteractivePreviewPage() {
  const { topicId, stepNumber } = useParams();
  const navigate = useNavigate();
  const step = Number(stepNumber);

  const [visual, setVisual] = useState<InteractiveVisual | null>(null);
  const [iframeContent, setIframeContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [nextStepNotFound, setNextStepNotFound] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);

  const is404 = (err: any) =>
    err?.status === 404 ||
    err?.message?.includes("404") ||
    err?.message?.toLowerCase().includes("not found");

  /* ---------------- FETCH ---------------- */
  const fetchVisual = async () => {
    if (!topicId) return;

    try {
      setLoading(true);
      setNotFound(false);

      const data = await getInteractiveVisual(topicId, step);
      setVisual(data);

      // FETCH HTML AS TEXT → inject via srcDoc to avoid download issue
      const res = await fetch(data.image_url);
      const html = await res.text();
      setIframeContent(html);
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
    fetchVisual();
  }, [step]);

  /* ---------------- GENERATE ---------------- */
  const handleGenerate = async () => {
    if (!topicId) return;

    try {
      setGenerating(true);
      await generateInteractiveVisual(topicId, step, "interactive");
      await fetchVisual();
      toast.success("Activity generated");
    } catch (err) {
      toast.error("Failed to generate");
    } finally {
      setGenerating(false);
    }
  };

  /* ---------------- NEXT ---------------- */
  const handleNext = async () => {
    const nextStep = step + 1;
    if (!topicId) return;

    try {
      await getInteractiveVisual(topicId, nextStep);
      navigate(`/admin/activity/${topicId}/${nextStep}/interactive`);
    } catch (err: any) {
      if (is404(err)) {
        setNextStepNotFound(true);
      }
    }
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
          <div className="bg-white rounded-2xl border w-full max-w-4xl h-[580px] animate-pulse" />

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

        ) : visual && iframeContent && (
          <>
            {/* CARD */}
            <div className="bg-white rounded-2xl border w-full max-w-4xl flex flex-col overflow-hidden">

              {/* IFRAME — srcDoc injects fetched HTML, avoids content-type download issue */}
              <iframe
                srcDoc={iframeContent}
                sandbox="allow-scripts"
                className="w-full"
                style={{ height: "580px", border: "none" }}
                title={`Interactive activity step ${step}`}
              />

              {/* QUESTION + EXPLANATION */}
              <div className="p-6 border-t">
                <p className="font-semibold text-gray-800 mb-3">
                  {visual.question.question}
                </p>

                {showExplanation ? (
                  <p className="text-sm text-gray-600">
                    {visual.question.explanation}
                  </p>
                ) : (
                  <button
                    onClick={() => setShowExplanation(true)}
                    className="text-indigo-700 text-sm font-medium"
                  >
                    Show Explanation
                  </button>
                )}
              </div>
            </div>

            {/* NEXT */}
            <div className="flex justify-end w-full max-w-4xl">
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