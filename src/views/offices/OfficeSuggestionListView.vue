<script setup lang="ts">
import { shallowRef, computed } from "vue";
import { useRoute } from "vue-router";
import { useFeedbacksByOffice, useDeleteFeedback } from "@/composables/use_feedback";
import type { Feedback } from "@/types/feedback_types";

const route = useRoute();

const officeId = computed(() => route.params.officeId as string);

const { data, isLoading, isError } = useFeedbacksByOffice(officeId);

const { deleteFeedbackMutate, isPending: isDeleting } = useDeleteFeedback();

const columns = shallowRef([
  {
    key: "student",
    label: "Email",
    render: (row: Feedback) => (row.is_anonymous ? "Anonymous" : (row.student?.email ?? "—")),
  },
  { key: "raw_text", label: "Feedback" },
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
      }),
  },
]);
</script>

<template>
  <div class="flex flex-col gap-4">
    <div v-if="isError" class="text-sm text-danger">Failed to load feedbacks.</div>
    <BaseTable
      v-else
      :data="data?.data ?? []"
      :columns="columns"
      :pagination="true"
      :page-size="15"
    />
    <div v-if="data?.pagination" class="flex items-center justify-between text-xs text-text-muted">
      <p>
        Showing {{ data.pagination.from }} to {{ data.pagination.to }} of
        {{ data.pagination.total }} feedbacks
      </p>
    </div>
  </div>
</template>
