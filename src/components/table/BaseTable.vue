<script setup lang="ts" generic="T">
import { computed, ref } from "vue";

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
  pageSize?: number;
}>();

const page = ref(1);

const pageSize = computed(() => props.pageSize ?? 10);

const totalPages = computed(() => Math.ceil(props.data.length / pageSize.value));

const paginatedData = computed(() => {
  if (!props.pagination) return props.data;

  const start = (page.value - 1) * pageSize.value;
  return props.data.slice(start, start + pageSize.value);
});

function nextPage() {
  if (page.value < totalPages.value) page.value++;
}

function prevPage() {
  if (page.value > 1) page.value--;
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
              v-for="(row, i) in paginatedData"
              :key="rowKey ? (row as any)[rowKey] : i"
              class="hover:bg-text-muted/5 transition"
            >
              <td v-for="col in columns" :key="col.label" class="px-4 py-6 text-text">
                <slot v-if="col.slot" :name="col.slot" :row="row" />
                <span v-else-if="col.render">{{ col.render(row) }}</span>
                <span v-else>{{ (row as any)[col.key as string] }}</span>
              </td>
            </tr>
            <tr v-if="paginatedData.length === 0">
              <td
                :colspan="columns.length"
                class="text-center py-10 text-text-muted border-y-2 border-border"
              >
                No records found
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <div v-if="pagination" class="flex items-center px-4 py-3">
      <button class="px-3 py-1 rounded bg-muted hover:bg-muted/70" @click="prevPage">Prev</button>

      <span class="text-sm text-text-muted"> Page {{ page }} / {{ totalPages || 1 }} </span>

      <button class="px-3 py-1 rounded bg-muted hover:bg-muted/70" @click="nextPage">Next</button>
    </div>
  </div>
</template>
