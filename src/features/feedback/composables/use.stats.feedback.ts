import { useQuery } from "@tanstack/vue-query";
import { getFeedbackStats } from "../api/feedback.api";
import { FEEDBACK_KEYS } from "../feedback.key";

export const useFeedbackStats = () => {
  const query = useQuery({
    queryKey: FEEDBACK_KEYS.stats(),
    queryFn: getFeedbackStats,
    staleTime: 1000 * 60 * 5,
  });

  return {
    stats: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};
