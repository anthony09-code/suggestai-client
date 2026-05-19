import api from "@/api";
import type { AuthResponse, LoginPayload, User } from "../types/auth.types";

export const login = (payload: LoginPayload) =>
  api
    .post<AuthResponse>("/api/login", payload, {
      silentError: true,
    })
    .then((r) => r.data);

export const logout = () =>
  api.post<{ success: boolean; message: string }>("/api/user/logout").then((r) => r.data);

export const logoutAll = () =>
  api.post<{ success: boolean; message: string }>("/api/user/logout-all").then((r) => r.data);

export const getMe = () =>
  api.get<{ success: boolean; user: User }>("/api/user").then((r) => r.data.user);
