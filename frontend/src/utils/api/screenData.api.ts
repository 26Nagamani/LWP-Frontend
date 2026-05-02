import fetchClient from "./fetchClient";

interface ActivityPreviewResponse {
  topic_id: string;
  topic_xml: string;
}

export const getActivityPreview = (topicId: string): Promise<ActivityPreviewResponse> =>
  fetchClient.get<ActivityPreviewResponse>(`/preview/${topicId}`);