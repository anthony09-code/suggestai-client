<script setup lang="ts">
import Card from "primevue/card";
import { IconLoader2 } from "@tabler/icons-vue";

defineProps<{
  title?: string;
  subtitle?: string;
  loading?: boolean;
}>();
</script>

<template>
  <Card
    unstyled
    :pt="{
      root: {
        class: ['bg-background', 'border border-border', 'rounded-md'],
      },
      body: {
        class: 'p-6',
      },
      title: {
        class: 'text-sm font-medium text-text',
      },
      subtitle: {
        class: 'text-sm text-text-muted mt-1',
      },
      content: {
        class: 'text-sm text-text',
      },
    }"
  >
    <template #title v-if="title">
      {{ title }}
    </template>

    <template #subtitle v-if="subtitle">
      {{ subtitle }}
    </template>

    <template #content>
      <div v-if="loading" class="flex items-center justify-center py-4">
        <IconLoader2 class="animate-spin text-border-neutral" :size="20" />
      </div>
      <slot v-else />
    </template>
  </Card>
</template>
