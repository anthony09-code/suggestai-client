<script setup lang="ts">
defineProps<{
  columns: { label: string; width?: string }[];
  rows?: number;
}>();
</script>

<template>
  <div class="w-full">
    <table class="w-full text-sm">
      <tbody>
        <tr v-for="n in rows ?? 10" :key="n" class="border-b border-border">
          <td
            v-for="col in columns"
            :key="col.label"
            class="px-4 py-3"
            :style="{ width: col.width }"
          >
            <BaseSkeleton height="1rem" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
