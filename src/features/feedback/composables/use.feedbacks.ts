import { useQuery, keepPreviousData } from "@tanstack/vue-query";
import { useFeedbackStore } from "../stores/feedback.store";
import { getFeedbacks, getFeedbacksByOffice } from "../api/feedback.api";
import { FEEDBACK_KEYS } from "../feedback.key";
import type { FeedbackParams } from "../types/feedback.types";
import { computed, toValue, type MaybeRefOrGetter } from "vue";

export type ReactiveFeedbackParams = MaybeRefOrGetter<FeedbackParams>;

export function useFeedbacks(params?: ReactiveFeedbackParams) {
  const feedbackStore = useFeedbackStore();

  return useQuery({
    queryKey: computed(() => FEEDBACK_KEYS.list(toValue(params))),
    queryFn: async () => {
      const unwrappedParams = toValue(params);
      const data = await getFeedbacks(unwrappedParams);

      console.log(data.data[0]);
      feedbackStore.setFeedbacks(data.data);
      feedbackStore.setTotal(data.pagination.total);
      return data;
    },
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });
}

export function useFeedbacksByOffice(accessLink: string, params?: ReactiveFeedbackParams) {
  const feedbackStore = useFeedbackStore();

  return useQuery({
    queryKey: computed(() => FEEDBACK_KEYS.byOffice(toValue(accessLink), toValue(params))),
    queryFn: async () => {
      const unwrappedLink = toValue(accessLink);
      const unwrappedParams = toValue(params);

      const data = await getFeedbacksByOffice(unwrappedLink, unwrappedParams);

      feedbackStore.setFeedbacks(data.data);
      feedbackStore.setTotal(data.pagination.total);
      return data;
    },
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
    enabled: () => !!toValue(accessLink),
  });
}
