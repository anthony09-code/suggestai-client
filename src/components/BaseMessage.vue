<script setup lang="ts">
import Message from "primevue/message";
import { IconX } from "@tabler/icons-vue";

defineProps<{
  severity?: "success" | "info" | "warn" | "error";
  title?: string;
  text?: string;
  closable?: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();
</script>

<template>
  <Message
    unstyled
    :severity="severity"
    :pt="{
      root: {
        class: [
          'w-full flex items-start gap-4 p-4 rounded-xl',

          severity === 'success' && 'bg-primary/10 text-primary',
          severity === 'info' && 'bg-blue-50 text-blue-700',
          severity === 'warn' && 'bg-yellow-50 text-yellow-700',
          severity === 'error' && 'bg-danger/10 text-danger',
          severity === 'secondary' && 'bg-background-neutral text-text-muted',

          !severity && 'bg-background text-text',
        ],
      },
    }"
  >
    <div class="flex items-center justify-between">
      <div class="flex flex-col gap-1">
        <p v-if="title" class="font-medium text-sm">
          {{ title }}
        </p>

        <p v-if="text" class="text-sm text-text-muted">
          {{ text }}
        </p>

        <slot />
      </div>

      <button
        v-if="closable"
        @click="emit('close')"
        class="shrink-0 text-current opacity-60 hover:opacity-100 transition"
      >
        <IconX :size="18" />
      </button>
    </div>
  </Message>
</template>
