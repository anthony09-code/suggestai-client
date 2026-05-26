export interface AnalyzeParams {
  date?: "all" | "today" | "this_week" | "this_month";
  status?: "all" | "pending" | "processed";
  anonymous?: "all" | "yes" | "no";
  date_from?: string;
  date_to?: string;
}

export interface AnalysisSession {
  id: string;
  office_id: string;
  user_id: string;
  feedback_count: number;
  topic_count: number;
  status: "pending" | "processing" | "completed" | "failed";
  date_from: string;
  date_to: string;
  started_at: string;
  created_at: string;
  updated_at: string;
}

export interface AnalyzeResponse {
  success: boolean;
  message: string;
  data: AnalysisSession;
}
