import type { FeedbackParams } from "./types/feedback.types";

export const FEEDBACK_KEYS = {
  all: ["feedbacks"] as const,
  list: (params?: FeedbackParams) => ["feedbacks", "list", params] as const,
  byOffice: (officeId: string, params?: FeedbackParams) =>
    ["feedbacks", "office", officeId, params] as const,
  detail: (id: string) => ["feedbacks", id] as const,
};
