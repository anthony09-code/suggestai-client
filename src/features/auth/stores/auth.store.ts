import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { User } from "../types/auth.types";

export const useAuthStore = defineStore("auth", () => {
  const token = ref<string | null>(localStorage.getItem("token"));
  const user = ref<User | null>(null);

  const isAuthenticated = computed(() => !!token.value);

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
    setToken,
    getToken,
    removeToken,
    clearAuth,
    setUser,
    logout,
  };
});
