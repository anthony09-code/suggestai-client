import { defineStore } from "pinia";
import { ref, computed, watchEffect } from "vue";
import type { User } from "@/types/auth_types";

export const useAuthStore = defineStore("auth", () => {
  const token = ref<string | null>(localStorage.getItem("token"));
  const user = ref<User | null>(null);

  const isAuthenticated = computed(() => !!token.value);

  const initials = computed(() => {
    const name = user.value?.full_name || user.value?.email || "User";
    const parts = name.split(" ").filter(Boolean);
    if (parts.length === 0) return "U";
    if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();

    return parts
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  });

  const setToken = (newToken: string) => {
    token.value = newToken;
    localStorage.setItem("token", newToken);
  };

  const getToken = () => token.value;

  const removeToken = () => {
    token.value = null;
    localStorage.removeItem("token");
  };

  const setUser = (newUser: User) => {
    user.value = newUser;
  };

  const logout = () => {
    removeToken();
    user.value = null;
  };

  const clearAuth = () => {
    token.value = null;
    user.value = null;
    localStorage.removeItem("token");
  };

  return {
    token,
    user,
    isAuthenticated,
    initials,
    setToken,
    getToken,
    removeToken,
    clearAuth,
    setUser,
    logout,
  };
});
