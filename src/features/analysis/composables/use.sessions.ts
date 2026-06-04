import { useQuery } from "@tanstack/vue-query";
import { getSession, getSessionsByOffice } from "../api/analysis.api";
import { ref, computed, type Ref } from "vue";
import { SESSION_KEYS } from "../sessions.key";
import type { AnalysisSession } from "../types/analysis.types";

export function useSession(sessionId: Ref<string | null>) {
  return useQuery({
    queryKey: computed(() => SESSION_KEYS.detail(sessionId.value!)),
    queryFn: () => getSession(sessionId.value!),
    enabled: computed(() => !!sessionId.value),
    retry: false,
    refetchInterval(query) {
      const status = query.state.data?.data?.status;
      return status === "pending" || status === "processing" ? 3000 : false;
    },
  });
}

export function useOfficeSession(
  accessLink: string,
  page: Ref<number> = ref(1),
  perPage: Ref<number> = ref(15),
  status?: Ref<string | undefined>,
) {
  const { data, isPending, isError } = useQuery({
    queryKey: computed(() =>
      SESSION_KEYS.byOfficeList(accessLink, page.value, perPage.value, status?.value),
    ),
    queryFn: () => getSessionsByOffice(accessLink, page.value, perPage.value, status?.value),
    refetchInterval(query) {
      const hasActive = query.state.data?.data?.some(
        (s: AnalysisSession) => s.status === "pending" || s.status === "processing",
      );
      return hasActive ? 3000 : false;
    },
  });

  const isAnalyzing = computed(() =>
    data.value?.data?.some(
      (s: AnalysisSession) => s.status === "pending" || s.status === "processing",
    ),
  );

  return { data, isPending, isError, isAnalyzing };
}
