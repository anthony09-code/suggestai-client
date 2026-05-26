<script setup lang="ts">
import Button from "primevue/button";

import { IconLoader2 } from "@tabler/icons-vue";

defineProps<{
  label?: string;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "danger" | "neutral";
  // size?: "small" | "large";
  disabled?: boolean;
  loading?: boolean;
}>();
</script>

<template>
  <Button
    :type="type ?? 'button'"
    :disabled="disabled || loading"
    unstyled
    :pt="{
      root: {
        class: [
          'inline-flex items-center justify-center gap-2',
          'py-2 px-3 text-sm rounded-md',
          'transition-colors duration-150 cursor-pointer',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          (!variant || variant === 'primary') &&
            'bg-primary text-text-white hover:bg-primary-strong',
          variant === 'danger' && 'bg-danger text-text-white hover:bg-danger-strong',
          variant === 'neutral' &&
            'bg-background-neutral text-text hover:bg-border border border-border',
        ],
      },
    }"
  >
    <template #default>
      <IconLoader2 v-if="loading" class="animate-spin" />
      <slot v-else>
        {{ label }}
      </slot>
    </template>
  </Button>
</template>
