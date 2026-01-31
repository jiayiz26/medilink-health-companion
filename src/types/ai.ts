export interface TriageResponse {
  severity: "emergency" | "urgent" | "routine";
  recommendation: string;
  response: string;
  suggested_specialty?: string;
}
