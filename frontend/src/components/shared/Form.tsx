import { useEffect, useState } from "react";
import type { TopicFormValues } from "../../types/topic.types";

interface Props {
  initialData?: TopicFormValues;
  onSubmit: (data: TopicFormValues) => void;
  onCancel: () => void;
}

export default function Form({ initialData, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<TopicFormValues>({
    name: "",
    board: "",
    subject: "",
    class: 1,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof TopicFormValues, string>>
  >({});

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: name === "class" ? Number(value) : value,
    });

    // Clear error on typing
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // Validation logic
  const validate = () => {
    const newErrors: typeof errors = {};

    if (!form.name.trim()) {
      newErrors.name = "Topic is required";
    }

    if (!form.board.trim()) {
      newErrors.board = "Board is required";
    }

    if (!form.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!form.class || form.class <= 0) {
      newErrors.class = "Class must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const handleSubmitClick = () => {
    if (!validate()) return;
    onSubmit(form);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-md">

        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          {initialData ? "Edit Topic" : "Add Topic"}
        </h2>

        {/* Fields */}
        <div className="space-y-5">

          {/* Topic */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Topic
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter topic name"
              className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Board */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Board
            </label>
            <input
              name="board"
              value={form.board}
              onChange={handleChange}
              placeholder="Enter board"
              className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.board ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.board && (
              <p className="text-red-500 text-sm mt-1">{errors.board}</p>
            )}
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Subject
            </label>
            <input
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="Enter subject"
              className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.subject ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.subject && (
              <p className="text-red-500 text-sm mt-1">
                {errors.subject}
              </p>
            )}
          </div>

          {/* Class */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Class
            </label>
            <input
              name="class"
              type="number"
              value={form.class}
              onChange={handleChange}
              placeholder="Enter class"
              className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.class ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.class && (
              <p className="text-red-500 text-sm mt-1">{errors.class}</p>
            )}
          </div>

        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={onCancel}
            className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmitClick}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {initialData ? "Update" : "Add"}
          </button>
        </div>

      </div>
    </div>
  );
}