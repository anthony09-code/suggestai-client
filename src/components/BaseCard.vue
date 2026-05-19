<script setup lang="ts">
import Card from "primevue/card";

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
        class: 'text-sm text-text-muted mb-6',
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
      <slot />
    </template>
  </Card>
</template>
