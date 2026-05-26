import api from "@/api";
import type { Office, CreateOfficePayload, UpdateOfficePayload } from "../types/office.types";

interface OfficeResponse {
  success: boolean;
  message: string;
  data: Office;
}

interface OfficeListResponse {
  success: boolean;
  message: string;
  data: Office[];
}

export const getOffices = () =>
  api.get<OfficeListResponse>("/api/offices").then((r) => r.data.data);

export const getOffice = (accessLink: string) =>
  api.get<OfficeResponse>(`/api/offices/${accessLink}`).then((r) => r.data.data);

export const createOffice = (payload: CreateOfficePayload) =>
  api.post<OfficeResponse>("/api/offices", payload).then((r) => r.data.data);

export const updateOffice = (accessLink: string, payload: UpdateOfficePayload) =>
  api.put<OfficeResponse>(`/api/offices/${accessLink}`, payload).then((r) => r.data.data);

export const deleteOffice = (accessLink: string) =>
  api
    .delete<{ success: boolean; message: string }>(`/api/offices/${accessLink}`)
    .then((r) => r.data);
