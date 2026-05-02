import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Breadcrumb from "../../../components/layout/Breadcrumb";
import { Trash2, Copy, Check } from "lucide-react";

import {
  fetchContext,
  uploadContextImages,
  fetchContextImages,
  triggerContextGenerate,
  deleteContextImage,
} from "../../../utils/api/context.api";

import { fetchTopics } from "../../../utils/api/topic.api";
import { fetchSteps } from "../../../utils/api/steps.api";

import type { TopicImage } from "../../../types/context.types";
import type { Topic } from "../../../types/topic.types";

export default function ContextPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();

  const [context, setContext] = useState("");
  const [contextId, setContextId] = useState<string | undefined>();
  const [images, setImages] = useState<TopicImage[]>([]);
  const [topicName, setTopicName] = useState("Topic");
  const [hasSteps, setHasSteps] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  // ---------------- INITIAL LOAD ----------------
  useEffect(() => {
    let ignore = false;

    const load = async () => {
      if (!topicId) {
        setLoading(false);
        return;
      }

      try {
        const [topics, ctx, imgs, steps] = await Promise.all([
          fetchTopics(),
          fetchContext(topicId),
          fetchContextImages(topicId),
          fetchSteps(topicId).catch(() => []),
        ]);

        if (!ignore) {
          const topic = topics.find(
            (t: Topic) => String(t.id) === String(topicId)
          );

          setTopicName(topic?.name || "Topic");

          if (ctx?.context) {
            setContext(ctx.context);
            setContextId(ctx.context_id);
          } else {
            setContext("");
          }

          setImages(imgs);
          setHasSteps(Array.isArray(steps) && steps.length > 0);
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    load();
    return () => {
      ignore = true;
    };
  }, [topicId]);

  // ---------------- COPY ----------------
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(context);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Copy failed");
    }
  };

  // ---------------- GENERATE ----------------
  const handleGenerate = async () => {
    if (!topicId) return;

    try {
      setSaving(true);
      await triggerContextGenerate(topicId);

      const ctx = await fetchContext(topicId);

      if (ctx?.context) {
        setContext(ctx.context);
        setContextId(ctx.context_id);
        toast.success("Context generated successfully");
      } else {
        toast.error("Failed to generate context");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  // ---------------- UPLOAD ----------------
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!topicId || !e.target.files) return;

    const files = Array.from(e.target.files);

    try {
      await uploadContextImages(topicId, files);
      const updatedImages = await fetchContextImages(topicId);
      setImages(updatedImages);
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    }
  };

  // ---------------- DELETE IMAGE ----------------
  const handleDeleteImage = async (index: number) => {
    const image = images[index];

    if (!image?.context_id) {
      setImages(prev => prev.filter((_, i) => i !== index));
      return;
    }

    try {
      await deleteContextImage(image.context_id);
      setImages(prev => prev.filter((_, i) => i !== index));
      toast.success("Image deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete image");
    }
  };

  // ---------------- CLEANUP ----------------
  useEffect(() => {
    const currentImages = images;

    return () => {
      currentImages.forEach((img) => {
        if (img.image_url.startsWith("blob:")) {
          URL.revokeObjectURL(img.image_url);
        }
      });
    };
  }, [images]);

  // ---------------- NAVIGATION ----------------
  const handleNext = () => {
    if (!topicId) return;
    navigate(`/admin/steps/${topicId}`);
  };

  if (loading) return <div className="p-6">Loading...</div>;

  const hasContext = !!context;

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <Breadcrumb
          items={[
            { label: topicName, path: `/admin/topic/${topicId}` },
            { label: "Context", path: `/admin/context/${topicId}` },
          ]}
        />

        <div className="flex gap-3">
          <label className="border px-4 py-2 rounded-lg hover:bg-gray-50 cursor-pointer">
            Upload Images
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
            />
          </label>

          <button
            onClick={handleGenerate}
            disabled={saving}
            className="border px-4 py-2 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            {saving
              ? "Generating..."
              : hasContext
              ? "Regenerate"
              : "Generate"}
          </button>
        </div>
      </div>

      {/* EMPTY */}
      {!hasContext && (
        <div className="flex flex-1 items-center justify-center text-gray-400">
          No context available
        </div>
      )}

      {/* MAIN */}
      {hasContext && (
        <div className="flex flex-col flex-1 gap-6">

          {/* TEXT */}
          <div className="flex flex-col h-1/2">
            <p className="text-xs text-gray-500 mb-2 uppercase">
              Text Context
            </p>

            <div className="relative bg-white border rounded-xl p-4 flex-1 overflow-y-auto whitespace-pre-line text-gray-700">

              {/* COPY BUTTON INSIDE BOX */}
              <button
                onClick={handleCopy}
                className="absolute top-3 right-3 p-1.5 rounded-md bg-gray-100 hover:bg-gray-200"
                title="Copy"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-600" />
                )}
              </button>

              {context}
            </div>
          </div>

          {/* IMAGES */}
          <div className="flex flex-col h-1/2">
            <p className="text-xs text-gray-500 mb-2 uppercase">
              Image Context
            </p>

            {images.length === 0 ? (
              <div className="flex flex-1 items-center justify-center text-gray-400">
                No images available
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4 overflow-y-auto flex-1">
                {images.map((img, idx) => (
                  <div
                    key={img.context_id ?? idx}
                    className="relative bg-white border rounded-xl p-2 flex items-center justify-center"
                  >
                    <button
                      onClick={() => handleDeleteImage(idx)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 shadow z-10"
                    >
                      <Trash2 size={14} />
                    </button>

                    <img
                      src={img.image_url}
                      alt="context"
                      className="w-full h-40 object-contain bg-gray-50 rounded-lg"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* NEXT */}
      <div className="flex justify-end mt-6">
        <button
          onClick={handleNext}
          className="border px-5 py-2 rounded-lg hover:bg-gray-50"
        >
          Next →
        </button>
      </div>

    </div>
  );
}