import { useEffect, useState } from "react";
import Form from "../../../components/shared/Form";
import Table from "../../../components/shared/Table";
import type { Topic, TopicFormValues } from "../../../types/topic.types";
import {fetchTopics, createTopic, updateTopic, deleteTopic, triggerFetch} from "../../../utils/api/topic.api";
import { useNavigate } from "react-router-dom";

export default function TopicPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState<Topic | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  const navigate = useNavigate();

  const refreshTopics = async () => {
    const data = await fetchTopics();
    setTopics(data);
  };

  useEffect(() => {
    refreshTopics();
  }, []);

  const handleSubmit = async (data: TopicFormValues) => {
    try {
      if (editData) {
        await updateTopic(editData.id, data);
        setMessage("Topic updated successfully");
      } else {
        const created = await createTopic(data);

        triggerFetch(created.id).catch(console.error);

        setMessage("Topic added successfully");
      }

    
      setShowForm(false);
      setEditData(null);

      refreshTopics();

      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (topic: Topic) => {
    setEditData(topic);
    setShowForm(true);
  };

  const handleRowClick = (topic: Topic) => {
    navigate(`/admin/context/${topic.id}`);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

 return (
  <div className="min-h-screen bg-gray-100 py-8">
    <div className="max-w-5xl mx-auto px-4 space-y-6">

  
      {message && (
        <div className="fixed top-5 right-5 bg-green-600 text-white px-4 py-2 rounded-lg shadow">
          {message}
        </div>
      )}


      {!showForm && (
        <>
     
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-800">
              Topic
            </h1>

            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
            >
              ADD
            </button>
          </div>

          <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
            <Table
              data={topics}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onRowClick={handleRowClick}
            />
          </div>
        </>
      )}

      {/* FORM */}
      {showForm && (
        <Form
          initialData={editData || undefined}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditData(null);
          }}
        />
      )}

  
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-87.5">

            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Delete Topic
            </h2>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this topic?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  await deleteTopic(deleteId);
                  setDeleteId(null);
                  refreshTopics();
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  </div>
);
}