import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Breadcrumb from "../../../components/layout/Breadcrumb";
import { fetchSteps, generateSteps } from "../../../utils/api/steps.api";
import { fetchTopics } from "../../../utils/api/topic.api";
import fetchClient from "../../../utils/api/fetchClient";

import type { Step } from "../../../types/steps.types";
import type { Topic } from "../../../types/topic.types";

export default function StepsPage() {
  const { topicId } = useParams<{ topicId: string }>();

  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState(true);
  const [topicName, setTopicName] = useState("Topic");

  const [deleteStep, setDeleteStep] = useState<Step | null>(null);
  const [editStep, setEditStep] = useState<Step | null>(null);

  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const navigate = useNavigate();

  // ----------- FETCH STEPS -----------
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

  // ----------- FETCH TOPIC -----------
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

  // ----------- GENERATE -----------
  const handleGenerate = async () => {
    if (!topicId) return;
    try {
      setLoading(true);
      await generateSteps(topicId);
      const data = await fetchSteps(topicId);
      setSteps(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ----------- DELETE -----------
  const confirmDelete = async () => {
    if (!deleteStep) return;
    try {
      await fetchClient.delete(`/steps/${deleteStep.id}/`);
      setSteps(prev => prev.filter(s => s.id !== deleteStep.id));
      setDeleteStep(null);
    } catch (err) {
      console.error(err);
    }
  };

  // ----------- EDIT -----------
  const openEditModal = (step: Step) => {
    setEditStep(step);
    setEditTitle(step.step_heading);
    setEditDesc(step.step_data);
  };

  const handleSaveEdit = async () => {
    if (!editStep) return;
    try {
      const updated = await fetchClient.put<Step>(`/steps/${editStep.id}/`, {
        step_heading: editTitle,
        step_data: editDesc,
      });
      setSteps(prev => prev.map(s => (s.id === editStep.id ? updated : s)));
      setEditStep(null);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-6 text-gray-400">Loading steps...</div>;

  return (
    <div className="min-h-screen bg-white p-6 flex flex-col">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <Breadcrumb
          items={[
            { label: topicName, path: `/admin/topic/${topicId}` },
            { label: "Context", path: `/admin/context/${topicId}` },
            { label: "Steps", path: `/admin/steps/${topicId}` },
          ]}
        />
        {steps.length > 0 && (
          <button
            onClick={handleGenerate}
            className="border px-4 py-2 rounded-lg hover:bg-gray-50"
          >
            Regenerate
          </button>
        )}
      </div>

      {/* EMPTY */}
      {steps.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <p className="text-gray-400">No steps generated yet</p>
          <button
            onClick={handleGenerate}
            className="border px-4 py-2 rounded-lg hover:bg-gray-50"
          >
            Generate
          </button>
        </div>
      )}

      {/* TABLE */}
      {steps.length > 0 && (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-left">
                <th className="px-5 py-3 w-8 text-gray-500">#</th>
                <th className="px-5 py-3 w-1/3 text-gray-500">Title</th>
                <th className="px-5 py-3 text-gray-500">Description</th>
                <th className="px-5 py-3 text-right text-gray-500">Actions</th>
              </tr>
            </thead>

            <tbody>
              {steps.map((step, index) => (
                <tr
                  key={step.id}
                  className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                >
                  <td className="px-5 py-4 text-gray-400">{index + 1}</td>

                  <td className="px-5 py-4 font-medium text-gray-800">
                    {step.step_heading}
                  </td>

                  <td className="px-5 py-4 text-gray-500">{step.step_data}</td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); openEditModal(step); }}
                        className="px-3 py-1.5 text-xs border rounded-lg hover:bg-gray-50"
                      >
                        Edit
                      </button>

                      <button
                        onClick={(e) => { e.stopPropagation(); setDeleteStep(step); }}
                        className="px-3 py-1.5 text-xs border border-red-200 text-red-500 rounded-lg hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* NEXT */}
      <div className="flex justify-end mt-auto pt-6">
        <button
          onClick={() => navigate(`/admin/activity/${topicId}`)}
          className="border px-5 py-2 rounded-lg hover:bg-gray-50"
        >
          Next →
        </button>
      </div>

      {/* EDIT MODAL */}
      {editStep && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Edit Step</h2>

            <div className="flex flex-col gap-3">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Step title"
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
              />
              <textarea
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                placeholder="Step description"
                rows={4}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditStep(null)}
                className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {deleteStep && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-base font-semibold text-gray-800 mb-2">Delete Step</h2>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-medium text-gray-700">{deleteStep.step_heading}</span>?
              This cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteStep(null)}
                className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}