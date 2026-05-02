import fetchClient from "./fetchClient";
import { ENDPOINTS } from "./endpoints";
import type { Context, TopicImage, TopicImagesResponse } from "../../types/context.types";

// GET context by topicId
export const fetchContext = async (
  topicId: string
): Promise<Context | null> => {
  const data = await fetchClient.get<Context>(
    `${ENDPOINTS.CONTEXT}/${topicId}`
  );

  if (!data) return null;

  return {
    context_id: data.context_id,
    topic_id: data.topic_id,
    context: data.context,
  };
};
export const saveContext = async (
  topicId: string,
  text: string,
  existingId?: string
): Promise<Context> => {
  const payload = {
    topic_id: topicId,
    context: text,
  };

  let data: Context;

  if (existingId) {
    data = await fetchClient.put<Context>(
      `${ENDPOINTS.CONTEXT}/${existingId}`,
      payload
    );
  } else {
    data = await fetchClient.post<Context>(
      ENDPOINTS.CONTEXT,
      payload
    );
  }

  return {
    context_id: data.context_id,
    topic_id: data.topic_id,
    context: data.context,
  };
};

export const uploadContextImages = async (
  topicId: string,
  files: File[]
): Promise<void> => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files", file); 
  });

  await fetchClient.post(
    `/context-images/${topicId}`,
    formData
  );
};

export const fetchContextImages = async (topicId: string): Promise<TopicImage[]> => {
  const data = await fetchClient.get<TopicImagesResponse>(`/context/${topicId}/images`);
  if (!data || !data.images) return [];
  return data.images as TopicImage[];
};

export const triggerContextGenerate = async (topicId: string): Promise<void> => {
  await fetchClient.post<void>(`/pms-context-generate/${topicId}`, {});
};


export const deleteContextImage = async (
  contextId: string
): Promise<void> => {
  await fetchClient.delete(`/context/delete-image/${contextId}`);
};