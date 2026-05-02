import type { Topic } from "../../types/topic.types";

interface Props {
  data: Topic[];
  onEdit: (topic: Topic) => void;
  onDelete: (id: string) => void;   
  onRowClick: (topic: Topic) => void;
}

export default function Table({
  data,
  onEdit,
  onDelete,
  onRowClick,
}: Props) {
  return (
    <table className="w-full text-sm">

      {/* HEADER */}
      <thead className="bg-gray-50 border-b">
        <tr>
          <th className="text-left px-6 py-4 font-medium text-gray-700">
            Topic Name
          </th>
          <th className="text-right px-6 py-4 font-medium text-gray-700">
            Actions
          </th>
        </tr>
      </thead>

      {/* BODY */}
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td
              colSpan={2}
              className="px-6 py-6 text-center text-gray-500"
            >
              No topics available
            </td>
          </tr>
        ) : (
          data.map((topic) => (
            <tr
              key={topic.id}
              className="border-b hover:bg-gray-50 cursor-pointer"
              onClick={() => onRowClick(topic)}
            >
              <td className="px-6 py-4 text-gray-800">
                {topic.name}
              </td>

              <td
                className="px-6 py-4 text-right space-x-4"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => onEdit(topic)}
                  className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Edit
                </button>

                <button
                  onClick={() => onDelete(topic.id)}
                  className="px-3 py-1.5 text-xs border border-red-100 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>

    </table>
  );
}