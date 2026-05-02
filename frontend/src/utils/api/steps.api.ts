import fetchClient from "./fetchClient";
import type { Step } from "../../types/steps.types";

export const generateSteps = (topicId: string) => {
  return fetchClient.post<void>(
    `/steps/generate/${topicId}`,
    {}
  );
};


export const fetchSteps = (topicId: string) => {
  return fetchClient.get<Step[]>(
    `/steps/${topicId}`
  );
};