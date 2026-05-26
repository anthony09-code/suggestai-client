import api from "@/api";
import type { Feedback, FeedbackParams } from "../types/feedback.types";
import type { PaginationMeta } from "@/types/pagination.types";

interface FeedbackResponse {
  success: boolean;
  message: string;
  data: Feedback;
}

interface FeedbackListResponse {
  success: boolean;
  message: string;
  data: Feedback[];
  pagination: PaginationMeta;
}

export const getFeedbacks = (params?: FeedbackParams) =>
  api.get<FeedbackListResponse>("/api/feedbacks", { params }).then((r) => r.data);

export const getFeedbacksByOffice = (accessLink: string, params?: FeedbackParams) =>
  api
    .get<FeedbackListResponse>(`/api/feedbacks/office/${accessLink}`, { params })
    .then((r) => r.data);

export const getFeedback = (id: string) =>
  api.get<FeedbackResponse>(`/api/feedbacks/${id}`).then((r) => r.data.data);

export const deleteFeedback = (id: string) =>
  api.delete<{ success: boolean; message: string }>(`/api/feedbacks/${id}`).then((r) => r.data);

export const exportFeedbacks = (
  accessLink: string,
  format: "csv" | "excel" | "pdf",
  params?: FeedbackParams,
) =>
  api.get(`/api/feedbacks/export/${accessLink}`, {
    params: { format, ...params },
    responseType: "blob",
    timeout: 60000,
  });
