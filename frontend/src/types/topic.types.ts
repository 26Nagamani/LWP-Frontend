export interface Topic {
  id: string;
  name: string;
  board: string;
  subject: string;
  class: number;
}

export interface TopicFormValues {
  name: string;
  board: string;
  subject: string;
  class: number;
}