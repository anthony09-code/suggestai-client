import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { analyzeOffice } from "../api/analysis.api";
import type { AnalyzeParams } from "../types/analysis.types";
import { SESSION_KEYS } from "../sessions.key";

export function useAnalyzeOffice(accessLink: string) {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, isSuccess, data, error } = useMutation({
    mutationFn: (params?: AnalyzeParams) => analyzeOffice(accessLink, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SESSION_KEYS.all });
    },
  });

  return {
    analyzeMutate: mutate,
    isPending,
    isError,
    isSuccess,
    data,
    error,
  };
}
