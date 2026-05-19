import { useQuery } from "@tanstack/vue-query";
import { getFeedback } from "../api/feedback.api";
import { FEEDBACK_KEYS } from "../feedback.key";

export function useFeedback(id: string) {
  return useQuery({
    queryKey: FEEDBACK_KEYS.detail(id),
    queryFn: () => getFeedback(id),
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });
}
