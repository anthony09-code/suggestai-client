import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { useFeedbackStore } from "../stores/feedback.store";
import { deleteFeedback } from "../api/feedback.api";
import { FEEDBACK_KEYS } from "../feedback.key";

export function useDeleteFeedback() {
  const queryClient = useQueryClient();
  const feedbackStore = useFeedbackStore();

  const { mutate: deleteFeedbackMutate, isPending } = useMutation({
    mutationFn: (id: string) => deleteFeedback(id),
    onSuccess: (_, id) => {
      feedbackStore.removeFeedback(id);
      queryClient.invalidateQueries({ queryKey: FEEDBACK_KEYS.all });
    },
  });

  return { deleteFeedbackMutate, isPending };
}
