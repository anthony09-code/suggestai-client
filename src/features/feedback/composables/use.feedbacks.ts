import { useQuery, keepPreviousData } from "@tanstack/vue-query";
import { useFeedbackStore } from "../stores/feedback.store";
import { getFeedbacks, getFeedbacksByOffice } from "../api/feedback.api";
import { FEEDBACK_KEYS } from "../feedback.key";
import type { FeedbackParams } from "../types/feedback.types";

export function useFeedbacks(params?: FeedbackParams) {
  const feedbackStore = useFeedbackStore();

  return useQuery({
    queryKey: FEEDBACK_KEYS.list(params),
    queryFn: async () => {
      const data = await getFeedbacks(params);
      feedbackStore.setFeedbacks(data.data);
      feedbackStore.setTotal(data.pagination.total);
      return data;
    },
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });
}

export function useFeedbacksByOffice(officeId: string, params?: FeedbackParams) {
  const feedbackStore = useFeedbackStore();

  return useQuery({
    queryKey: FEEDBACK_KEYS.byOffice(officeId, params),
    queryFn: async () => {
      const data = await getFeedbacksByOffice(officeId, params);
      feedbackStore.setFeedbacks(data.data);
      feedbackStore.setTotal(data.pagination.total);
      return data;
    },
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
    enabled: !!officeId,
  });
}
