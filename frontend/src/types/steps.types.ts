export type Step = {
  id: string;
  step_count: number;
  step_heading: string;
  step_data: string;
  step_datatype: string;
  topic_id: string;
  context_id: string;
};
export type StepsResponse = {
  breadcrumb: string[];
  steps: Step[];
};