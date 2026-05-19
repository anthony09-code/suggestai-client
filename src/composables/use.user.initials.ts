import { computed } from "vue";
import { useAuthStore } from "@/features/auth/stores/auth.store";

export function useUserInitials() {
  const authStore = useAuthStore();

  const initials = computed(() => {
    const name = authStore.user?.full_name || authStore.user?.email || "User";
    const parts = name.split(" ").filter(Boolean);

    if (parts.length === 0) return "U";
    if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();

    return parts
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  });

  return { initials };
}
