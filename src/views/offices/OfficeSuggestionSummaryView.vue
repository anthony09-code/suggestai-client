<script setup lang="ts">
import { ref, computed } from "vue";
import {
  IconLoader2,
  IconCircleCheck,
  IconAlertCircle,
  IconEye,
  IconTrash,
  IconDownload,
} from "@tabler/icons-vue";
import { useOfficeSession, useSession } from "@/features/analysis/composables/use.sessions";
import { downloadSessionReport } from "@/features/analysis/api/analysis.api";
import { useBaseRouter } from "@/composables/use.router";
import type { AnalysisSession } from "@/features/analysis/types/analysis.types";

const { params } = useBaseRouter();
const accessLink = params.value.accessLink as string;

const currentPage = ref(1);
const pageSize = ref(15);

const { data, isPending, isError } = useOfficeSession(accessLink, currentPage, pageSize);

const columns = [
  { label: "Office", slot: "office", width: "160px" },
  { label: "Status", slot: "status", width: "120px" },
  { label: "Feedbacks", slot: "feedback_count", width: "120px" },
  { label: "Topics", slot: "topic_count", width: "100px" },
  { label: "Date From", slot: "date_from" },
  { label: "Date To", slot: "date_to" },
  { label: "", slot: "actions", width: "100px" },
];

const sessionToView = ref<AnalysisSession | null>(null);

const viewVisible = computed({
  get: () => !!sessionToView.value,
  set: (val) => {
    if (!val) sessionToView.value = null;
  },
});

const sessionId = computed(() => sessionToView.value?.id ?? null);
const { data: sessionDetail, isPending: isLoadingDetail } = useSession(sessionId);

const sortedTopics = computed(() =>
  [...(sessionDetail.value?.data?.topics ?? [])].sort(
    (a, b) => b.feedback_count - a.feedback_count,
  ),
);

const deleteVisible = computed({
  get: () => !!sessionToDelete.value,
  set: (val) => {
    if (!val) sessionToDelete.value = null;
  },
});

const sessionToDelete = ref<AnalysisSession | null>(null);

function handleView(row: AnalysisSession) {
  sessionToView.value = row;
}

async function handleDownload(row: AnalysisSession) {
  if (row.status !== "completed") return;

  try {
    await downloadSessionReport(row.id);
  } catch (error) {
    console.error(error);
  }
}

function handleDelete(row: AnalysisSession) {
  sessionToDelete.value = row;
}

function confirmDelete() {
  // wire up later
  sessionToDelete.value = null;
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <BaseMessage v-if="isError" severity="error" title="Failed to load sessions." />

    <BaseTable
      v-model:page="currentPage"
      :data="data?.data ?? []"
      :columns="columns"
      :loading="isPending"
      :pagination="true"
      :page-size="pageSize"
      :total-records="data?.pagination?.total ?? 0"
      record-label="sessions"
      @update:page-size="
        pageSize = $event;
        currentPage = 1;
      "
    >
      <template #office="{ row }: { row: AnalysisSession }">
        <span class="text-sm font-medium text-text">
          {{ row.office?.office_name ?? "—" }}
        </span>
      </template>

      <template #status="{ row }: { row: AnalysisSession }">
        <div class="flex items-center gap-1.5">
          <IconLoader2
            v-if="row.status === 'pending' || row.status === 'processing'"
            :size="15"
            class="animate-spin text-text-muted"
          />
          <IconCircleCheck v-else-if="row.status === 'completed'" :size="15" class="text-primary" />
          <IconAlertCircle v-else-if="row.status === 'failed'" :size="15" class="text-danger" />
          <span
            class="text-xs font-medium capitalize"
            :class="{
              'text-text-muted': row.status === 'pending' || row.status === 'processing',
              'text-primary': row.status === 'completed',
              'text-danger': row.status === 'failed',
            }"
          >
            {{ row.status }}
          </span>
        </div>
      </template>

      <template #feedback_count="{ row }: { row: AnalysisSession }">
        <span class="text-sm text-text">{{ row.feedback_count }}</span>
      </template>

      <template #topic_count="{ row }: { row: AnalysisSession }">
        <span class="text-sm text-text">{{ row.topic_count }}</span>
      </template>

      <template #date_from="{ row }: { row: AnalysisSession }">
        <span class="text-sm text-text-muted">
          {{ row.date_from ? new Date(row.date_from).toLocaleDateString() : "—" }}
        </span>
      </template>

      <template #date_to="{ row }: { row: AnalysisSession }">
        <span class="text-sm text-text-muted">
          {{ row.date_to ? new Date(row.date_to).toLocaleDateString() : "—" }}
        </span>
      </template>

      <template #started_at="{ row }: { row: AnalysisSession }">
        <span class="text-sm text-text-muted">
          {{ row.started_at ? new Date(row.started_at).toLocaleString() : "—" }}
        </span>
      </template>

      <template #completed_at="{ row }: { row: AnalysisSession }">
        <span class="text-sm text-text-muted">
          {{ row.completed_at ? new Date(row.completed_at).toLocaleString() : "—" }}
        </span>
      </template>

      <template #actions="{ row }: { row: AnalysisSession }">
        <div class="flex items-center gap-1">
          <button
            class="p-1.5 rounded-md text-text-muted hover:text-text hover:bg-background-neutral transition-colors"
            title="View"
            @click="handleView(row)"
          >
            <IconEye :size="16" />
          </button>
          <button
            class="p-1.5 rounded-md text-text-muted hover:text-text hover:bg-background-neutral transition-colors"
            title="Download"
            @click="handleDownload(row)"
          >
            <IconDownload :size="16" />
          </button>
          <button
            class="p-1.5 rounded-md text-text-muted hover:text-danger hover:bg-red-50 transition-colors"
            title="Delete"
            @click="handleDelete(row)"
          >
            <IconTrash :size="16" />
          </button>
        </div>
      </template>
    </BaseTable>
  </div>

  <BaseDialog
    v-model:visible="viewVisible"
    title="Identified Topics"
    :description="`${sessionDetail?.data?.topic_count ?? 0} topics were found from your feedbacks.`"
    size="lg"
  >
    <!-- skeleton -->
    <div v-if="isLoadingDetail" class="flex flex-col gap-3">
      <div
        v-for="i in 4"
        :key="i"
        class="flex items-start justify-between gap-4 p-3 rounded-lg bg-background-neutral"
      >
        <div class="flex flex-col gap-2 min-w-0 flex-1">
          <BaseSkeleton height="0.875rem" width="40%" />
          <div class="flex gap-1 mt-1">
            <BaseSkeleton v-for="j in 3" :key="j" height="1.25rem" width="3.5rem" />
          </div>
        </div>
        <BaseSkeleton height="0.75rem" width="4rem" />
      </div>
    </div>

    <!-- topics list -->
    <div v-else class="flex flex-col gap-3 overflow-y-auto max-h-[60vh] pr-1">
      <div
        v-for="topic in sortedTopics"
        :key="topic.id"
        class="flex items-start justify-between gap-4 p-3 rounded-lg bg-background-neutral"
      >
        <div class="flex flex-col gap-1 min-w-0">
          <span class="text-sm font-medium text-text">{{ topic.label }}</span>
          <p v-if="topic.description" class="text-xs text-text-muted leading-5">
            {{ topic.description }}
          </p>
          <div class="flex flex-wrap gap-1 mt-1">
            <span
              v-for="keyword in topic.keywords"
              :key="keyword"
              class="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary"
            >
              {{ keyword }}
            </span>
          </div>
        </div>
        <span class="text-xs text-text-muted shrink-0 mt-0.5">
          {{ topic.feedback_count }} feedback{{ topic.feedback_count !== 1 ? "s" : "" }}
        </span>
      </div>

      <p
        v-if="!sessionDetail?.data?.topics?.length"
        class="text-sm text-text-muted text-center py-4"
      >
        No topics found for this session.
      </p>
    </div>

    <template #footer="{ close }">
      <BaseButton variant="neutral" label="Close" @click="close" />
    </template>
  </BaseDialog>

  <BaseDialog v-model:visible="deleteVisible" title="Delete Session" size="sm">
    <p class="text-sm text-text-muted">
      Are you sure you want to delete this session? This action cannot be undone.
    </p>

    <template #footer="{ close }">
      <BaseButton variant="neutral" label="Cancel" @click="close" />
      <BaseButton variant="danger" label="Delete" @click="confirmDelete" />
    </template>
  </BaseDialog>
</template>
