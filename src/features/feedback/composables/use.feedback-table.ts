import { shallowRef, ref } from "vue";
import type { Feedback } from "../types/feedback.types";

export function useFeedbackTable() {
  const failedImages = ref<Set<string>>(new Set());
  const expandedRows = ref<Set<string>>(new Set());

  function onImageError(studentId: string) {
    failedImages.value = new Set([...failedImages.value, studentId]);
  }

  function toggleRow(id: string) {
    const next = new Set(expandedRows.value);
    next.has(id) ? next.delete(id) : next.add(id);
    expandedRows.value = next;
  }

  const columns = shallowRef([
    {
      key: "student",
      label: "Email",
      slot: "student",
    },
    {
      key: "raw_text",
      label: "Feedback",
      slot: "raw_text",
    },
    {
      key: "status",
      label: "Status",
      render: (row: Feedback) => (row.status === "pending" ? "Pending" : "Processed"),
    },
    {
      key: "created_at",
      label: "Submitted",
      render: (row: Feedback) =>
        new Date(row.created_at).toLocaleDateString("en-PH", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
  ]);

  return {
    failedImages,
    expandedRows,
    onImageError,
    toggleRow,
    columns,
  };
}
