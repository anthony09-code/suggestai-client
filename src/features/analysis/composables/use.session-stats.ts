import { useQuery } from "@tanstack/vue-query";
import { getSessionStats } from "../api/analysis.api";
import { SESSION_KEYS } from "../sessions.key";

export const useSessionStats = () => {
  const query = useQuery({
    queryKey: SESSION_KEYS.stats(),
    queryFn: getSessionStats,
    staleTime: 1000 * 60 * 5,
  });

  return {
    stats: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
};
