import fetchClient from "./fetchClient";

export const generateVisual = (topicId: string, stepNumber: number, type: string) => {
  return fetchClient.post<any>(
    `/activity/generate-visual/${topicId}/${stepNumber}/${type}`,
    {}
  );
};

export const getVisual = (topicId: string, stepNumber: number) => {
  return fetchClient.get<any>(`/activity/get-visuals/${topicId}/${stepNumber}`);
};

export const generateInteractiveVisual = (
  topicId: string,
  stepNumber: number,
  type: string
) => {
  return fetchClient.post<any>(
    `/activity/generate-interactive-visual/${topicId}/${stepNumber}/${type}`,
    {}
  );
};

export const getInteractiveVisual = (topicId: string, stepNumber: number) => {
  return fetchClient.get<any>(
    `/activity/get-interactive-visual/${topicId}/${stepNumber}`
  );
};