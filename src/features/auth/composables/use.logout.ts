import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { logout } from "../api/auth.api";
import { useAuthStore } from "../stores/auth.store";
import { useOfficeStore } from "@/features/office/stores/office.store";
import { useRouter } from "vue-router";

export function useLogout() {
  const auth = useAuthStore();
  const officeStore = useOfficeStore();
  const queryClient = useQueryClient();
  const router = useRouter();

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
