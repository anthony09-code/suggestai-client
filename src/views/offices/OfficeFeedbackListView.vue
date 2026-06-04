<script setup lang="ts">
import { ref, computed, watch, nextTick } from "vue";
import { IconSpy, IconUser, IconFilter, IconCalendar, IconDownload } from "@tabler/icons-vue";
import {
  dateOptions,
  statusOptions,
  anonymousOptions,
  exportOptions,
} from "@/constants/feedback.filter.options";
import type {
  DateFilter,
  StatusFilter,
  AnonymousFilter,
  ExportFormat,
} from "@/features/analysis/types/analysis.types";
import { useBaseRouter } from "@/composables/use.router";
import { useFeedbacksByOffice } from "@/features/feedback/composables/use.feedbacks";
import { useAnalyzeFeedbacks } from "@/features/analysis/composables/use.analyze.feedback";
import { useAnalysisStore } from "@/features/analysis/stores/analysis.store";
import { useFeedbackTable } from "@/features/feedback/composables/use.feedback-table";
import { useExportFeedbacks } from "@/features/feedback/composables/use.export.feedbacks";
import { getToast } from "@/lib/toast";

const { params } = useBaseRouter();
const accessLink = params.value.accessLink as string;
const toast = getToast();

// ── dialogs ───────────────────────────────────────────────────────────────────
const summarizeVisible = ref(false);
const topicsVisible = ref(false);

// ── filters ───────────────────────────────────────────────────────────────────
const dateFilter = ref<DateFilter>("all");
const statusFilter = ref<StatusFilter>("all");
const anonymousFilter = ref<AnonymousFilter>("all");
const exportFilter = ref<ExportFormat | "all">("all");
const currentPage = ref(1);
const pageSize = ref(15);

const queryParams = computed(() => ({
  date: dateFilter.value,
  status: statusFilter.value,
  anonymous: anonymousFilter.value,
  export: exportFilter.value,
  page: currentPage.value,
  per_page: pageSize.value,
}));

const hasActiveFilters = computed(
  () =>
    dateFilter.value !== "all" || statusFilter.value !== "all" || anonymousFilter.value !== "all",
);

function clearFilters() {
  dateFilter.value = "all";
  statusFilter.value = "all";
  anonymousFilter.value = "all";
}

watch([dateFilter, statusFilter, anonymousFilter], () => {
  currentPage.value = 1;
});

// ── data ──────────────────────────────────────────────────────────────────────
const { data, isFetching, isError } = useFeedbacksByOffice(accessLink, queryParams);
const { failedImages, expandedRows, onImageError, toggleRow, columns } = useFeedbackTable();
const { exportFile, isExporting } = useExportFeedbacks(accessLink);
const { analyze, isAnalyzing } = useAnalyzeFeedbacks(accessLink);
const analysisStore = useAnalysisStore();

// ── export ────────────────────────────────────────────────────────────────────
watch(exportFilter, (format) => {
  if (format !== "all") {
    exportFile(format, {
      date: dateFilter.value,
      status: statusFilter.value,
      anonymous: anonymousFilter.value,
    });
    nextTick(() => {
      exportFilter.value = "all";
    });
  }
});

// ── analyze ───────────────────────────────────────────────────────────────────
function handleAnalyze() {
  analyze(
    {
      date: dateFilter.value,
      status: statusFilter.value,
      anonymous: anonymousFilter.value,
    },
    {
      onError: (message) => {
        toast.add({
          severity: "error",
          summary: "Failed to queue analysis",
          detail: message,
          life: 5000,
        });
      },
      onFailed: () => {
        toast.add({
          severity: "error",
          summary: "Analysis failed",
          detail: "Could not complete the analysis. Please try again.",
          life: 5000,
        });
      },
      onSessionError: () => {
        toast.add({
          severity: "error",
          summary: "Analysis failed",
          detail: "Something went wrong while checking analysis status.",
          life: 5000,
        });
      },
    },
  );
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <BaseMessage v-if="isError" severity="error" title="Failed to load feedbacks." />

    <BaseMessage
      v-else-if="analysisStore.completedSession && !analysisStore.isSessionSaved"
      severity="success"
      :title="`Summarize complete — ${analysisStore.completedSession.topic_count} topic${analysisStore.completedSession.topic_count !== 1 ? 's' : ''} identified.`"
      closable
      @close="analysisStore.clearCompletedSession()"
      class="mb-4"
    >
      <button
        class="text-sm font-medium underline underline-offset-2 mt-1 cursor-pointer"
        @click="topicsVisible = true"
      >
        View topics
      </button>
    </BaseMessage>

    <!-- toolbar -->
    <div class="flex items-start justify-between gap-4 flex-wrap">
      <div class="flex items-center gap-1 flex-wrap">
        <BaseDropdown
          v-model="dateFilter"
          :options="dateOptions"
          placeholder="Date"
          :icon="IconCalendar"
          size="large"
          class="w-44"
        />
        <BaseDropdown
          v-model="statusFilter"
          :options="statusOptions"
          placeholder="Status"
          :icon="IconFilter"
          class="w-44"
        />
        <BaseDropdown
          v-model="anonymousFilter"
          :options="anonymousOptions"
          placeholder="Anonymous"
          :icon="IconUser"
          class="w-44"
        />
        <BaseClearFiltersButton :visible="hasActiveFilters" @clear="clearFilters" />
      </div>

      <div class="flex items-center gap-1 flex-wrap">
        <BaseDropdown
          v-model="exportFilter"
          :options="exportOptions"
          placeholder="Export"
          :icon="IconDownload"
          :disabled="isExporting"
          class="w-35"
        />
        <BaseButton
          variant="primary"
          label="Summarize"
          :loading="isAnalyzing"
          :disabled="isAnalyzing || !data?.pagination?.total"
          @click="!isAnalyzing && (summarizeVisible = true)"
        />
      </div>
    </div>

    <!-- table -->
    <BaseTable
      v-model:page="currentPage"
      :data="data?.data ?? []"
      :columns="columns"
      :loading="isFetching"
      :pagination="true"
      :page-size="pageSize"
      :total-records="data?.pagination?.total ?? 0"
      @update:page-size="
        pageSize = $event;
        currentPage = 1;
      "
    >
      <template #student="{ row }">
        <div class="flex items-center gap-3 py-1">
          <div class="relative shrink-0">
            <img
              v-if="
                !row.is_anonymous &&
                row.student?.profile_picture &&
                !failedImages.has(row.student.id)
              "
              :src="row.student.profile_picture"
              :alt="row.student?.name"
              class="w-9 h-9 rounded-full object-cover ring-1 ring-border"
              loading="lazy"
              @error="onImageError(row.student.id)"
            />
            <div
              v-else
              class="w-9 h-9 rounded-full bg-background-neutral flex items-center justify-center"
            >
              <IconSpy v-if="row.is_anonymous" :size="18" :stroke="2" class="text-text-muted" />
              <span v-else class="text-xs font-medium text-text-muted">
                {{ row.student?.name?.[0]?.toUpperCase() ?? "?" }}
              </span>
            </div>
          </div>
          <div class="flex flex-col min-w-0 leading-tight">
            <span class="text-sm font-medium text-text truncate">
              {{ row.is_anonymous ? "Anonymous" : (row.student?.name ?? "—") }}
            </span>
            <span class="text-xs text-text-muted truncate mt-0.5">
              {{ row.is_anonymous ? "" : (row.student?.email ?? "—") }}
            </span>
          </div>
        </div>
      </template>

      <template #raw_text="{ row }">
        <div class="max-w-125 cursor-pointer py-1" @click="toggleRow(row.id)">
          <p
            class="text-sm leading-6 text-text wrap-break-word transition-all duration-200"
            :class="expandedRows.has(row.id) ? '' : 'line-clamp-2'"
          >
            {{ row.raw_text ?? "—" }}
          </p>
          <span
            v-if="row.raw_text && row.raw_text.length > 100"
            class="text-xs text-text-muted mt-1 inline-block"
          >
            {{ expandedRows.has(row.id) ? "Show less" : "Show more" }}
          </span>
        </div>
      </template>
    </BaseTable>
  </div>

  <!-- summarize confirm dialog -->
  <BaseDialog
    v-model:visible="summarizeVisible"
    title="Summarize Feedbacks"
    :description="`${data?.pagination?.total ?? 0} feedback${(data?.pagination?.total ?? 0) !== 1 ? 's' : ''} will be analyzed based on your current filters.`"
    size="lg"
  >
    <p class="text-sm text-text-muted">
      This will generate a topic summary for
      <span class="font-semibold text-primary">{{ data?.pagination?.total ?? 0 }}</span>
      feedback(s)
      <template v-if="hasActiveFilters"> matching your active filters</template>
      <template v-else> across all feedbacks</template>. This may take a moment.
    </p>

    <template #footer="{ close }">
      <BaseButton variant="neutral" label="Cancel" @click="close" />
      <BaseButton
        variant="primary"
        label="Summarize"
        :loading="isAnalyzing"
        :disabled="isAnalyzing"
        @click="
          () => {
            handleAnalyze();
            close();
          }
        "
      />
    </template>
  </BaseDialog>

  <!-- topics dialog -->
  <BaseDialog
    v-model:visible="topicsVisible"
    title="Identified Topics"
    :description="`${analysisStore.completedSession?.topic_count ?? 0} topics were found from your feedbacks.`"
    size="xl"
  >
    <div class="flex flex-col gap-3 overflow-y-auto max-h-[60vh]">
      <div
        v-for="topic in analysisStore.completedSession?.topics ?? []"
        :key="topic.id"
        class="flex items-start justify-between gap-4 p-3 rounded-lg bg-background-neutral"
      >
        <div class="flex flex-col gap-1 min-w-0">
          <span class="text-sm font-medium text-text">{{ topic.label }}</span>
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
    </div>

    <template #footer="{ close }">
      <BaseButton variant="neutral" label="Close" @click="close" />
      <!-- <BaseButton
        variant="primary"
        label="Save"
        @click="
          () => {
            analysisStore.saveSession();
            close();
          }
        "
      /> -->
    </template>
  </BaseDialog>
</template>
