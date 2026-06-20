<script setup lang="ts">
defineProps<{
  title?: string;
  subtitle?: string;
}>();
</script>
<template>
  <div class="flex items-center justify-between mb-4">
    <div>
      <h3 class="text-base font-medium">{{ title }}</h3>
      <p class="text-sm text-text-muted">{{ subtitle }}</p>
    </div>
  </div>
</template>
