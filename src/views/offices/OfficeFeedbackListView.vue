<script setup lang="ts">
import { ref, computed, watch, nextTick } from "vue";
import { useRoute } from "vue-router";
import {
  IconQuestionMark,
  IconUser,
  IconFilter,
  IconCalendar,
  IconDownload,
} from "@tabler/icons-vue";
import { useFeedbacksByOffice } from "@/features/feedback/composables/use.feedbacks";
import { useAnalyzeOffice } from "@/features/analysis/composables/use.analyze";
import { useFeedbackTable } from "@/features/feedback/composables/use.feedback-table";
import { useExportFeedbacks } from "@/features/feedback/composables/use.export.feedbacks";
import {
  dateOptions,
  statusOptions,
  anonymousOptions,
  exportOptions,
} from "@/constants/feedback.filter.options";

const route = useRoute();

const accessLink = route.params.accessLink as string;

const dateFilter = ref("all");
const statusFilter = ref("all");
const anonymousFilter = ref("all");
const exportFilter = ref("all");

const currentPage = ref(1);
const pageSize = 15;

const queryParams = computed(() => ({
  date: dateFilter.value,
  status: statusFilter.value,
  anonymous: anonymousFilter.value,
  export: exportFilter.value,
  page: currentPage.value,
  per_page: pageSize,
}));

const hasActiveFilters = computed(
  () =>
    dateFilter.value !== "all" || statusFilter.value !== "all" || anonymousFilter.value !== "all",
);

const { data, isLoading, isError } = useFeedbacksByOffice(accessLink, queryParams);
const { analyzeMutate, isPending: isAnalyzing } = useAnalyzeOffice(accessLink);
const { failedImages, expandedRows, onImageError, toggleRow, columns } = useFeedbackTable();
const { exportFile, isExporting } = useExportFeedbacks(accessLink);

function handleAnalyze() {
  analyzeMutate({
    date: dateFilter.value as any,
    status: statusFilter.value as any,
    anonymous: anonymousFilter.value as any,
  });
}

function handleExport(format: "csv" | "excel" | "pdf") {
  exportFile(format, {
    date: dateFilter.value,
    status: statusFilter.value,
    anonymous: anonymousFilter.value,
  });
}

function clearFilters() {
  dateFilter.value = "all";
  statusFilter.value = "all";
  anonymousFilter.value = "all";
}

watch([dateFilter, statusFilter, anonymousFilter], () => {
  currentPage.value = 1;
});

watch(exportFilter, (format) => {
  if (format !== "all") {
    handleExport(format as "csv" | "excel" | "pdf");
    nextTick(() => {
      exportFilter.value = "all";
    });
  }
});
</script>

<template>
  <div class="flex flex-col gap-5">
    <div class="flex items-start justify-between gap-4 flex-wrap mb-1">
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
          size="small"
          label="Generate Topics"
          :loading="isAnalyzing"
          :disabled="isAnalyzing"
          @click="handleAnalyze"
        />
      </div>
    </div>

    <BaseMessage
      v-if="isError"
      severity="error"
      title="Failed to load feedbacks."
      text="Something went wrong while fetching feedback records."
    />

    <BaseTable
      v-else
      v-model:page="currentPage"
      :data="data?.data ?? []"
      :columns="columns"
      :loading="isLoading"
      :pagination="true"
      :page-size="pageSize"
      :total-records="data?.pagination?.total ?? 0"
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
              <IconQuestionMark
                v-if="row.is_anonymous"
                :size="14"
                :stroke="2"
                class="text-text-muted"
              />

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
        <div class="max-w-xl cursor-pointer py-1" @click="toggleRow(row.id)">
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

    <div
      v-if="data?.pagination"
      class="flex items-center justify-between text-xs text-text-muted pt-1"
    >
      <p>
        Showing {{ data.pagination.from }} to {{ data.pagination.to }} of
        {{ data.pagination.total }} feedbacks
      </p>
    </div>
  </div>
</template>
