import { useQuery } from "@tanstack/vue-query";
import { getMe } from "../api/auth.api";
import { useAuthStore } from "../stores/auth.store";

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
