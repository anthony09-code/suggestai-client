import api from "@/api";
import type { AnalyzeParams, AnalyzeResponse } from "../types/analysis.types";

export const analyzeOffice = (accessLink: string, params?: AnalyzeParams) =>
  api.post<AnalyzeResponse>(`/api/sessions/analyze/${accessLink}`, params).then((r) => r.data);
