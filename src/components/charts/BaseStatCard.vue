<script setup lang="ts">
defineProps<{
  label: string;
  value: string | number;
  subtitle?: string;
  loading?: boolean;
  highlight?: boolean;
}>();
</script>

<template>
  <BaseCard>
    <template v-if="loading">
      <div class="flex items-center justify-between">
        <BaseSkeleton height="14px" width="60%" />
        <BaseSkeleton height="16px" width="30%" />
      </div>
      <BaseSkeleton height="12px" width="40%" class="mt-2" />
    </template>

    <template v-else>
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium text-text-muted">
          {{ label }}
        </span>

        <span class="text-base font-medium text-text">
          {{ value }}
        </span>
      </div>

      <span v-if="subtitle" class="text-xs" :class="highlight ? 'text-primary' : 'text-text-muted'">
        {{ subtitle }}
      </span>
    </template>
  </BaseCard>
</template>
