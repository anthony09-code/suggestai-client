import { useMutation } from "@tanstack/vue-query";
import { useRouter } from "vue-router";
import { ref } from "vue";

import { login } from "../api/auth.api";
import { useAuthStore } from "../stores/auth.store";

import type { LoginPayload } from "../types/auth.types";
import type { LoginErrorResponse } from "../types/auth.types";
import type { AxiosError } from "axios";

import { parseLoginError } from "../utils/auth.errors";
import { useLockout } from "@/composables/use.lockout";

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
      const { message, lockoutSeconds: wait } = parseLoginError(
        err as AxiosError<LoginErrorResponse>,
      );
      if (message) errorMessage.value = message;
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
