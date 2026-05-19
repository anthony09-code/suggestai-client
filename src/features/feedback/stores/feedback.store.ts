import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Feedback } from "../types/feedback.types";

export const useFeedbackStore = defineStore("feedback", () => {
  const feedbacks = ref<Feedback[]>([]);
  const total = ref(0);

  const pendingFeedbacks = computed(() => feedbacks.value.filter((f) => f.status === "pending"));

  const processedFeedbacks = computed(() =>
    feedbacks.value.filter((f) => f.status === "processed"),
  );

  const pendingCount = computed(() => pendingFeedbacks.value.length);
  const processedCount = computed(() => processedFeedbacks.value.length);

  const setFeedbacks = (data: Feedback[]) => {
    feedbacks.value = data;
  };

  const setTotal = (count: number) => {
    total.value = count;
  };

  const removeFeedback = (id: string) => {
    feedbacks.value = feedbacks.value.filter((f) => f.id !== id);
  };

  const getFeedbackById = (id: string) => feedbacks.value.find((f) => f.id === id) ?? null;

  const clear = () => {
    feedbacks.value = [];
    total.value = 0;
  };

  return {
    feedbacks,
    total,
    pendingFeedbacks,
    processedFeedbacks,
    pendingCount,
    processedCount,
    setFeedbacks,
    setTotal,
    removeFeedback,
    getFeedbackById,
    clear,
  };
});
