<script setup lang="ts">
defineProps<{
  title?: string;
}>();
</script>

<template>
  <div class="bg-background border border-border p-6 rounded-xl">
    <p v-if="title" class="text-sm font-medium text-text-muted mb-4">{{ title }}</p>
    <slot />
  </div>
</template>
