export interface AIResponse {
  content: string;
  metadata?: Record<string, any>;
  thread_id?: string;
}

export interface TriageResponse {
  severity: "emergency" | "urgent" | "routine";
  recommendation: string;
  response: string;
  suggested_specialty?: string;
}
