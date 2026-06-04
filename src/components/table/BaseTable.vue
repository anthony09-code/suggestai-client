<script setup lang="ts" generic="T">
import { computed } from "vue";
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from "@tabler/icons-vue";

type ColumnDef<T> = {
  key?: keyof T | string;
  label: string;
  width?: string;
  sortable?: boolean;
  render?: (row: T) => string | number | null;
  slot?: string;
};

const props = defineProps<{
  data: T[];
  columns: ColumnDef<T>[];
  loading?: boolean;
  rowKey?: keyof T | string;
  pagination?: boolean;
  totalRecords: number;
  page: number;
  pageSize: number;
  pageSizeOptions?: number[];
  recordLabel?: string;
}>();

const emit = defineEmits<{
  "update:page": [page: number];
  "update:pageSize": [size: number];
}>();

const PAGE_SIZE_OPTIONS = computed(() => props.pageSizeOptions ?? [15, 25, 50, 100]);

const totalPages = computed(() => Math.ceil(props.totalRecords / props.pageSize));

const fromRecord = computed(() => {
  if (!props.totalRecords) return 0;
  return (props.page - 1) * props.pageSize + 1;
});

const toRecord = computed(() => Math.min(props.page * props.pageSize, props.totalRecords));

const pageWindow = computed(() => {
  const total = totalPages.value;
  if (total <= 1) return [];
  const delta = 2;
  const left = Math.max(1, props.page - delta);
  const right = Math.min(total, props.page + delta);
  const pages: (number | "...")[] = [];

  if (left > 1) {
    pages.push(1);
    if (left > 2) pages.push("...");
  }
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < total) {
    if (right < total - 1) pages.push("...");
    pages.push(total);
  }
  return pages;
});

function onPageSizeChange(e: Event) {
  emit("update:pageSize", Number((e.target as HTMLSelectElement).value));
  emit("update:page", 1);
}

function goToPage(p: number) {
  if (p >= 1 && p <= totalPages.value && p !== props.page) {
    emit("update:page", p);
  }
}

function nextPage() {
  if (props.page < totalPages.value) emit("update:page", props.page + 1);
}

function prevPage() {
  if (props.page > 1) emit("update:page", props.page - 1);
}
</script>

<template>
  <div class="bg-background overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="bg-background">
          <tr>
            <th
              v-for="col in columns"
              :key="col.label"
              class="text-left px-4 py-3 text-text font-medium"
              :style="{ width: col.width }"
            >
              {{ col.label }}
            </th>
          </tr>
        </thead>

        <tbody class="border-y border-border">
          <template v-if="loading">
            <tr v-for="n in pageSize" :key="`skeleton-${n}`" class="border-b border-border/50">
              <td v-for="col in columns" :key="col.label" class="px-4 py-6">
                <BaseSkeleton height="16px" />
              </td>
            </tr>
          </template>
          <template v-else>
            <tr
              v-for="(row, i) in data"
              :key="rowKey ? (row as any)[rowKey] : i"
              class="hover:bg-text-muted/5 transition"
            >
              <td v-for="col in columns" :key="col.label" class="px-4 py-6 text-text">
                <slot v-if="col.slot" :name="col.slot" :row="row" />
                <span v-else-if="col.render">{{ col.render(row) }}</span>
                <span v-else>{{ (row as any)[col.key as string] }}</span>
              </td>
            </tr>
            <tr v-if="data.length === 0">
              <td
                :colspan="columns.length"
                class="text-center text-text-muted border-y-2 border-border"
              ></td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <div
      v-if="pagination"
      class="flex items-center justify-between gap-x-4 gap-y-2 px-4 py-3 flex-wrap"
    >
      <div class="flex items-center gap-3 flex-wrap">
        <div class="flex items-center gap-2">
          <span class="text-sm text-text-muted whitespace-nowrap">Rows per page</span>
          <select
            :value="pageSize"
            class="text-sm text-text bg-background border border-border rounded px-2 py-1 focus:outline-none focus:ring-text cursor-pointer hover:border-text transition-colors duration-150"
            @change="onPageSizeChange"
          >
            <option v-for="opt in PAGE_SIZE_OPTIONS" :key="opt" :value="opt">
              {{ opt }}
            </option>
          </select>
        </div>

        <span class="text-border text-xs hidden sm:inline">|</span>

        <p class="text-sm text-text-muted whitespace-nowrap">
          <template v-if="totalRecords > 0">
            Showing
            <span class="font-medium text-text">{{ fromRecord }}</span>
            –
            <span class="font-medium text-text">{{ toRecord }}</span>
            of
            <span class="font-medium text-text">{{ totalRecords }}</span>
            {{ recordLabel ?? "records" }}
          </template>
          <template v-else> No {{ recordLabel ?? "records" }} </template>
        </p>
      </div>

      <div class="flex items-center gap-1">
        <button
          class="flex items-center justify-center w-7 h-7 text-text-muted rounded-lg hover:bg-background-neutral hover:text-text transition duration-150 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          :disabled="page === 1"
          aria-label="First page"
          @click="goToPage(1)"
        >
          <IconChevronsLeft :size="18" />
        </button>

        <button
          class="flex items-center justify-center w-7 h-7 text-text-muted rounded-lg hover:bg-background-neutral hover:text-text transition duration-150 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          :disabled="page === 1"
          aria-label="Previous page"
          @click="prevPage"
        >
          <IconChevronLeft :size="18" />
        </button>

        <template v-for="p in pageWindow" :key="p">
          <span
            v-if="p === '...'"
            class="w-7 h-7 flex items-center justify-center text-sm text-text-muted select-none"
          >
            ···
          </span>
          <button
            v-else
            class="w-7 h-7 rounded-lg text-sm font-medium transition duration-150 cursor-pointer"
            :class="
              p === page
                ? 'bg-primary text-white'
                : 'text-text-muted hover:bg-background-neutral hover:text-text'
            "
            @click="goToPage(p as number)"
          >
            {{ p }}
          </button>
        </template>

        <button
          class="flex items-center justify-center w-7 h-7 text-text-muted rounded-lg hover:bg-background-neutral hover:text-text transition duration-150 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          :disabled="page === totalPages || totalPages === 0"
          aria-label="Next page"
          @click="nextPage"
        >
          <IconChevronRight :size="18" />
        </button>

        <button
          class="flex items-center justify-center w-7 h-7 text-text-muted rounded-lg hover:bg-background-neutral hover:text-text transition duration-150 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          :disabled="page === totalPages || totalPages === 0"
          aria-label="Last page"
          @click="goToPage(totalPages)"
        >
          <IconChevronsRight :size="18" />
        </button>
      </div>
    </div>
  </div>
</template>
