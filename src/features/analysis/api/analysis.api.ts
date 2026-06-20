import api from "@/api";
import type {
  AnalyzeParams,
  AnalyzeResponse,
  SessionsResponse,
  SessionDetailResponse,
} from "../types/analysis.types";

export const analyzeOffice = (accessLink: string, params?: AnalyzeParams) =>
  api.post<AnalyzeResponse>(`/api/sessions/analyze/${accessLink}`, params).then((r) => r.data);

export const getSession = (sessionId: string) =>
  api.get<SessionDetailResponse>(`/api/sessions/${sessionId}`).then((r) => r.data);

export const getSessionsByOffice = (accessLink: string, page = 1, perPage = 15, status?: string) =>
  api
    .get<SessionsResponse>(`/api/sessions/office/${accessLink}`, {
      params: { page, per_page: perPage, status },
    })
    .then((r) => r.data);

export const getSessionStats = () => api.get("/api/sessions/stats").then((r) => r.data.data);

export const downloadSessionReport = (sessionId: string) =>
  api
    .get(`/api/sessions/${sessionId}/report/download`, {
      responseType: "blob",
    })
    .then((r) => {
      const url = URL.createObjectURL(new Blob([r.data], { type: "application/pdf" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `analysis-report-${sessionId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    });
