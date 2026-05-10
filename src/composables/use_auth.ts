import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { login, logout, getMe } from "../api/auth_api";
import { useAuthStore } from "@/stores/auth_store";
import { useOfficeStore } from "@/stores/office_store";
import { useRouter } from "vue-router";
import { ref } from "vue";
import type { LoginPayload } from "../types/auth_types";
import { parseLoginError } from "../utils/auth_errors";
import { useLockout } from "./use_lockout";

function useAuthContext() {
  return {
    auth: useAuthStore(),
    officeStore: useOfficeStore(),
    queryClient: useQueryClient(),
    router: useRouter(),
  };
}

export function useLogin() {
  const auth = useAuthStore();
  const router = useRouter();
  const errorMessage = ref("");
  const { isLockedOut, lockoutSeconds, start: startLockout } = useLockout();

  const { mutate: loginMutate, isPending } = useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: (data) => {
      auth.setToken(data.token);
      auth.setUser(data.user);
      router.push("/dashboard");
    },
    onError: (err) => {
      const { message, lockoutSeconds: wait } = parseLoginError(err);
      errorMessage.value = message;
      if (wait) startLockout(wait);
    },
  });

  function handleLogin(
    payload: LoginPayload,
    callbacks?: { onSuccess?: () => void; onError?: () => void },
  ) {
    if (isLockedOut.value) return;
    errorMessage.value = "";
    loginMutate(payload, {
      onSuccess: () => callbacks?.onSuccess?.(),
      onError: () => callbacks?.onError?.(),
    });
  }

  return { handleLogin, isPending, errorMessage, isLockedOut, lockoutSeconds };
}

export function useLogout() {
  const { auth, officeStore, queryClient, router } = useAuthContext();

  function clearSession() {
    auth.clearAuth();
    officeStore.clearOffices();
    queryClient.clear();
    router.push("/login");
  }

  const { mutate: logoutMutate, isPending } = useMutation({
    mutationFn: logout,
    onSuccess: clearSession,
    onError: clearSession,
  });

  return { logoutMutate, isPending };
}

export function useCurrentUser() {
  const auth = useAuthStore();

  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const user = await getMe();
      auth.setUser(user);
      return user;
    },
    enabled: () => auth.isAuthenticated,
    staleTime: 1000 * 60 * 5,
  });
}
