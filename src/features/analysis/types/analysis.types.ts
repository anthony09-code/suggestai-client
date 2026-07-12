import {
  dateOptions,
  anonymousOptions,
  statusOptions,
  exportOptions,
} from "@/constants/feedback.filter.options";
import type { PaginationMeta } from "@/types/pagination.types";

export type DateFilter = (typeof dateOptions)[number]["value"];
export type AnonymousFilter = (typeof anonymousOptions)[number]["value"];
export type StatusFilter = (typeof statusOptions)[number]["value"];
export type ExportFormat = Exclude<(typeof exportOptions)[number]["value"], "all">;

export interface AnalyzeParams {
  date?: DateFilter;
  status?: StatusFilter;
  anonymous?: AnonymousFilter;
}

export interface Topic {
  id: string;
  label: string;
  keywords: string[];
  description: string | null
  feedback_count: number;
  cluster_x: number;
  cluster_y: number;
  created_at: string;
}

export interface SessionDetail extends AnalysisSession {
  topics: Topic[];
}

export interface SessionDetailResponse {
  success: boolean;
  message: string;
  data: SessionDetail;
}

export interface SessionStats {
  total_sessions: number;
  total_topics: number;
  topics_per_office: { office_name: string; topic_count: number }[];
  top_topics: { text: string; weight: number }[];
}

export interface AnalysisSession {
  id: string;
  office_id: string;
  office?: { office_name: string };
  user_id: string;
  feedback_count: number;
  topic_count: number;
  status: "pending" | "processing" | "completed" | "failed";
  date_from: string;
  date_to: string;
  started_at: string;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AnalyzeResponse {
  success: boolean;
  message: string;
  data: AnalysisSession;
}

export interface SessionsResponse {
  success: boolean;
  message: string;
  data: AnalysisSession[];
  pagination: PaginationMeta;
}
