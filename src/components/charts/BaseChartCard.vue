<script setup lang="ts">
defineProps<{
  title?: string;
  subtitle?: string;
  loading?: boolean;
  height?: string;
}>();
</script>

<template>
  <BaseCard :title="!loading ? title : undefined" :subtitle="!loading ? subtitle : undefined">
    <div v-if="loading" class="mb-4">
      <BaseSkeleton height="16px" width="40%" />
      <BaseSkeleton height="12px" width="50%" class="mt-2" />
    </div>

    <div v-if="loading">
      <BaseSkeleton :height="height || '280px'" width="100%" />
    </div>

    <div v-else>
      <slot />
    </div>
  </BaseCard>
</template>
