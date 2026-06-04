import { ref, computed, watch } from "vue";
import { useAnalyzeOffice } from "./use.analyze";
import { useSession } from "./use.sessions";
import { useAnalysisStore } from "../stores/analysis.store";
import type { AnalyzeParams, SessionDetail, SessionDetailResponse } from "../types/analysis.types";
import axios from "axios";

export function useAnalyzeFeedbacks(accessLink: string) {
  const analysisStore = useAnalysisStore();
  const { analyzeMutate, isPending: isSubmitting } = useAnalyzeOffice(accessLink);

  const pollingSessionId = ref<string | null>(null);
  const isPolling = computed(() => !!pollingSessionId.value);
  const isAnalyzing = computed(() => isSubmitting.value || isPolling.value);

  const { data: sessionData, isError: isSessionError } = useSession(pollingSessionId);

  watch(sessionData, (val: SessionDetailResponse | undefined) => {
    const status = val?.data?.status;

    if (status === "completed") {
      pollingSessionId.value = null;
      analysisStore.setCompletedSession(val!.data as SessionDetail);
    }

    if (status === "failed") {
      pollingSessionId.value = null;
    }
  });

  watch(isSessionError, (hasError) => {
    if (hasError) pollingSessionId.value = null;
  });

  function analyze(
    params: AnalyzeParams,
    callbacks?: {
      onSuccess?: () => void;
      onError?: (message: string) => void;
      onFailed?: () => void;
      onSessionError?: () => void;
    },
  ) {
    analyzeMutate(params, {
      onSuccess: (res) => {
        pollingSessionId.value = res.data.id;
        callbacks?.onSuccess?.();

        const stopFailedWatch = watch(sessionData, (val: SessionDetailResponse | undefined) => {
          if (!pollingSessionId.value) return;
          if (val?.data?.id !== pollingSessionId.value) return;

          if (val?.data?.status === "failed") {
            callbacks?.onFailed?.();
            stopFailedWatch();
          }
        });

        const stopErrorWatch = watch(isSessionError, (hasError) => {
          if (hasError) {
            callbacks?.onSessionError?.();
            stopErrorWatch();
          }
        });
      },
      onError: (error: Error) => {
        const message = axios.isAxiosError<{ message: string }>(error)
          ? (error.response?.data?.message ?? "Something went wrong.")
          : "Something went wrong.";
        callbacks?.onError?.(message);
      },
    });
  }

  return {
    analyze,
    isAnalyzing,
    isPolling,
    isSubmitting,
  };
}
