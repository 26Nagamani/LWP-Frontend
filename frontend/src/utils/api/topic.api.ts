import fetchClient from "./fetchClient";
import { ENDPOINTS } from "./endpoints";
import type { Topic } from "../../types/topic.types";

export const fetchTopics = async (): Promise<Topic[]> => {
  const data = await fetchClient.get<any[]>(ENDPOINTS.TOPICS);

  return data.map((item) => ({
    id: item.id,
    name: item.topic_name,           
    board: item.board,
    subject: item.subject_name,      
    class: Number(item.class_),     
  }));
};

export const createTopic = async (formData: {
  name: string;
  board: string;
  subject: string;
  class: number | string;
}) => {
  const payload = {
    topic_name: formData.name,
    board: formData.board,
    subject_name: formData.subject,
    class_: String(formData.class),
  };

  return await fetchClient.post("/topics", payload);
};

export const updateTopic = async (
  id: string,
  payload: {
    name: string;
    board: string;
    subject: string;
    class: number;
  }
) => {
  const data = await fetchClient.patch<any>(   
    `${ENDPOINTS.TOPICS}/${id}`,
    {
      topic_name: payload.name,
      board: payload.board,
      subject_name: payload.subject,
      class_: String(payload.class),
    }
  );

  return {
    id: data.id,
    name: data.topic_name,
    board: data.board,
    subject: data.subject_name,
    class: data.class_,
  };
};

export const deleteTopic = async (id: string): Promise<void> => {
  await fetchClient.delete(`${ENDPOINTS.TOPICS}/${id}`);
};

export const triggerFetch = async (topicId: string): Promise<void> => {
  await fetchClient.post<void>(`/pms-context-generate/${topicId}`, {});
};