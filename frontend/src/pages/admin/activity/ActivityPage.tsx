import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Breadcrumb from "../../../components/layout/Breadcrumb";
import { fetchSteps } from "../../../utils/api/steps.api";
import { fetchTopics } from "../../../utils/api/topic.api";
import { getVisual, getInteractiveVisual } from "../../../utils/api/activity.api";

import ActivityTypeModal from "../activityType/ActivityTypeModal";

import type { Step } from "../../../types/steps.types";
import type { Topic } from "../../../types/topic.types";

export default function ActivityPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();

  const [steps, setSteps] = useState<Step[]>([]);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [topicName, setTopicName] = useState("Topic");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStep, setSelectedStep] = useState<number | null>(null);

  const is404 = (result: PromiseSettledResult<any>) =>
    result.status === "rejected" &&
    (result.reason?.status === 404 ||
      result.reason?.message?.includes("404") ||
      result.reason?.message?.toLowerCase().includes("not found"));

  const [fetchingActivity, setFetchingActivity] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // FETCH STEPS
  useEffect(() => {
    if (!topicId) return;
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchSteps(topicId);
        setSteps(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [topicId]);

  // FETCH TOPIC NAME
  useEffect(() => {
    if (!topicId) return;
    const loadTopic = async () => {
      try {
        const topics = await fetchTopics();
        const topic = topics.find((t: Topic) => t.id === topicId);
        setTopicName(topic?.name || "Topic");
      } catch (err) {
        console.error(err);
      }
    };
    loadTopic();
  }, [topicId]);

  const handlePreviewClick = () => {
    if (!topicId) return;
    navigate(`/admin/screen-data/${topicId}`);
  };
 const handleTitleClick = async (stepNumber: number) => {
  if (!topicId) return;

  setSelectedStep(stepNumber);
  setFetchingActivity(true);

  try {
    const [visualResult, interactiveResult] = await Promise.allSettled([
      getVisual(topicId, stepNumber),
      getInteractiveVisual(topicId, stepNumber),
    ]);

    const visual =
      visualResult.status === "fulfilled" ? visualResult.value : null;

    const interactive =
      interactiveResult.status === "fulfilled"
        ? interactiveResult.value
        : null;
    if (!visual && !interactive) {
      setIsModalOpen(true);
      return;
    }
    if (interactive?.activity_id || interactive?.image_url) {
      navigate(
        `/admin/activity/${topicId}/${stepNumber}/interactive`,
        {
          state: {
            data: interactive,
            type: "interactive",
          },
        }
      );
      return;
    }
    if (visual?.image_url || visual?.question) {
      navigate(
        `/admin/activity/${topicId}/${stepNumber}/options`,
        {
          state: {
            data: visual,
            type: "visual",
          },
        }
      );
      return;
    }

    setIsModalOpen(true);
  } catch (err) {
    console.error(err);
    setIsModalOpen(true);
  } finally {
    setFetchingActivity(false);
  }
};

  return (
    <div className="relative min-h-screen bg-white p-6 flex flex-col">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <Breadcrumb
          items={[
            { label: topicName, path: `/admin/topic/${topicId}` },
            { label: "Context", path: `/admin/context/${topicId}` },
            { label: "Steps", path: `/admin/steps/${topicId}` },
            { label: "Activity", path: `/admin/activity/${topicId}` },
          ]}
        />

        {steps.length > 0 && (
          <button
            onClick={handlePreviewClick}
            className="border px-4 py-2 rounded-lg hover:bg-gray-50 text-base"
          >
            Preview
          </button>
        )}
      </div>

      {/* EMPTY */}
      {steps.length === 0 && (
        <div className="flex-1 flex items-center justify-center text-gray-400">
          No steps generated yet
        </div>
      )}

      {/* STEPPER */}
      {steps.length > 0 && (
        <div className="flex flex-col">
          {steps.map((step, index) => {
            const isActive = index === activeStep;
            const isLast = index === steps.length - 1;

            return (
              <div
                key={step.id}
                className="flex gap-4 cursor-pointer"
                onClick={() => setActiveStep(index)}
              >
                {/* LEFT */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isActive ? "border-blue-600" : "border-gray-300"
                    }`}
                  >
                    {isActive && (
                      <div className="w-3 h-3 rounded-full bg-blue-600" />
                    )}
                  </div>

                  {!isLast && (
                    <div className="w-[2px] flex-1 bg-gray-200 my-1" />
                  )}
                </div>

                {/* RIGHT */}
                <div className={`flex flex-col pb-6 ${isLast ? "pb-0" : ""}`}>
                  <p
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTitleClick(index + 1);
                    }}
                    className={`text-base font-semibold hover:text-blue-600 ${
                      isActive ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    {step.step_heading}
                  </p>

                  {isActive && (
                    <p className="text-base text-gray-400 mt-1">
                      {step.step_data}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TOAST */}
      {toastMessage && (
        <div className="fixed top-6 right-6 bg-red-50 border border-red-300 text-red-600 text-sm font-medium px-5 py-3 rounded-lg shadow-md z-50">
          ⚠️ {toastMessage}
        </div>
      )}

      {/* GETTING ACTIVITY OVERLAY */}
      {fetchingActivity && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
          <p className="text-gray-400 text-base">Getting activity...</p>
        </div>
      )}

      {/* MODAL */}
      {topicId && selectedStep !== null && (
        <ActivityTypeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          topicId={topicId}
          stepNumber={selectedStep}
        />
      )}
    </div>
  );
}