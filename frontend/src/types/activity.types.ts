export type StepMode = "interactive" | "options";

export interface OptionItem {
  "@_id": string;
  "#text": string;
}

export interface Navigation {
  prev_step?: string | null;
  next_step?: string | null;
}

export interface RawStep {
  "@_number": string;
  "@_mode": StepMode;
  navigation?: Navigation;
  image: string;
  question?: string;
  audio?: string;         
  speak_line?: string; 
  options?: {
    option: OptionItem | OptionItem[];
  };
  explanation?: string;
  answer?: string;
}

export interface ParsedStep {
  number: string;
  mode: StepMode;
  navigation: Navigation;
  image: string;
  question?: string;
  audio?: string;         
  speak_line?: string; 
  options?: OptionItem[];
  explanation?: string;
  answer?: string;
}

