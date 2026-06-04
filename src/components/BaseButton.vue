<script setup lang="ts">
import Button from "primevue/button";

import { IconLoader2 } from "@tabler/icons-vue";

const props = defineProps<{
  label?: string;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "danger" | "neutral";
  disabled?: boolean;
  loading?: boolean;
}>();

const emit = defineEmits<{ click: [e: MouseEvent] }>();

function handleClick(e: MouseEvent) {
  if (props.disabled || props.loading) return;
  emit("click", e);
}
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
          'py-2 px-3 text-sm rounded-md min-w-24 min-h-9',
          'transition-colors duration-150 cursor-pointer',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          (!variant || variant === 'primary') &&
            'bg-primary text-text-white hover:bg-primary-strong',
          variant === 'danger' && 'bg-danger text-text-white hover:bg-danger-strong',
          variant === 'neutral' &&
            'bg-background-neutral text-text hover:bg-border border border-border',
        ],
      },
    }"
    @click="handleClick"
  >
    <template #default>
      <IconLoader2 v-if="loading" class="animate-spin" :size="18" />
      <slot v-else>
        {{ label }}
      </slot>
    </template>
  </Button>
</template>
