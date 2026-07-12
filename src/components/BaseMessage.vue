<script setup lang="ts">
import { IconX } from "@tabler/icons-vue";

defineProps<{
  severity?: "success" | "info" | "warn" | "error" | "secondary";
  title?: string;
  text?: string;
  closable?: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const severityMap = {
  success: {
    wrapper: "bg-primary/10 border border-primary/20",
    textColor: "text-primary",
  },
  info: {
    wrapper: "bg-blue-50 border border-blue-200",
    textColor: "text-blue-700",
  },
  warn: {
    wrapper: "bg-yellow-50 border border-yellow-200",
    textColor: "text-yellow-700",
  },
  error: {
    wrapper: "bg-danger/10 border border-danger/20",
    textColor: "text-danger",
  },
  secondary: {
    wrapper: "bg-background-neutral border border-border",
    textColor: "text-text-muted",
  },
};
</script>

<template>
  <div
    class="w-full flex items-start gap-3 p-4 rounded-xl"
    :class="severity ? severityMap[severity].wrapper : 'bg-background border border-border'"
  >
    <div class="flex-1 flex flex-col gap-1 min-w-0">
      <p
        v-if="title"
        class="font-medium text-sm"
        :class="severity ? severityMap[severity].textColor : 'text-text'"
      >
        {{ title }}
      </p>
      <p
        v-if="text"
        class="text-sm"
        :class="severity ? severityMap[severity].textColor : 'text-text-muted'"
      >
        {{ text }}
      </p>
      <slot />
    </div>

    <button
      v-if="closable"
      @click="emit('close')"
      class="shrink-0 opacity-60 hover:opacity-100 transition mt-0.5"
      :class="severity ? severityMap[severity].textColor : 'text-text'"
    >
      <IconX :size="18" stroke="2" />
    </button>
  </div>
</template>
