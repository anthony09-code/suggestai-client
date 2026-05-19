export function parseLoginError(err: any): { message: string; lockoutSeconds?: number } {
  if (!navigator.onLine || err.code === "ERR_NETWORK") {
    return { message: "No internet connection. Please check your network." };
  }

  const data = err.response?.data;
  const status = err.response?.status;

  switch (status) {
    case 401: {
      const remaining = data?.attempts_remaining;
      const wait = data?.retry_after ?? 60;

      if (remaining === 0) {
        return {
          message: `Too many failed attempts. Please wait ${wait} seconds.`,
          lockoutSeconds: wait,
        };
      }
      if (remaining !== undefined) {
        return {
          message: `${data?.message} ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`,
        };
      }
      return { message: data?.message ?? "Invalid email or password." };
    }
    case 422:
      return { message: data?.message ?? "Human verification failed." };
    case 429: {
      const retryAfter = err.response?.headers?.["retry-after"];
      const wait = retryAfter ? parseInt(retryAfter) : 60;
      return {
        message: `Too many attempts. Please wait ${wait} seconds.`,
        lockoutSeconds: wait,
      };
    }
    default:
      return { message: data?.message ?? "Login failed. Please try again." };
  }
}
