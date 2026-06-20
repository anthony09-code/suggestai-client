<script setup lang="ts">
import { computed } from "vue";
import Dialog from "primevue/dialog";
import { IconX } from "@tabler/icons-vue";

interface Props {
  visible: boolean;
  title?: string;
  description?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  showClose?: boolean;
  closable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: "",
  description: "",
  size: "md",
  showClose: true,
  closable: true,
});

const emit = defineEmits<{
  (e: "update:visible", value: boolean): void;
  (e: "hide"): void;
  (e: "show"): void;
}>();

const sizeClasses: Record<NonNullable<Props["size"]>, string> = {
  sm: "w-full max-w-sm",
  md: "w-full max-w-md",
  lg: "w-full max-w-lg",
  xl: "w-full max-w-2xl",
  full: "w-full max-w-5xl",
};

const panelClass = computed(
  () =>
    `${sizeClasses[props.size]} mx-auto rounded-2xl bg-white ring-1 ring-black/5 overflow-hidden`,
);

const pt = computed(() => ({
  root: {
    class: "fixed inset-0 z-50 flex items-center p-4",
  },
  mask: {
    class: "fixed inset-0 z-40 bg-black/50",
  },
  header: {
    class: "flex items-start justify-between gap-4 px-6 pt-6 pb-0",
  },
  title: {
    class: "text-sm leading-snug",
  },
  icons: {
    class: "flex items-center shrink-0 -mt-0.5",
  },
  closeButton: {
    class:
      "inline-flex items-center justify-center w-8 h-8 rounded-lg text-text-muted hover:text-text-muted hover:bg-background-neutral transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-border -mt-0.5 cursor-pointer",
  },
  closeButtonIcon: {
    class: "w-4 h-4",
  },
  content: {
    class: "px-6 py-4 text-sm text-text-muted leading-relaxed",
  },
  footer: {
    class:
      "flex items-center justify-end gap-2 px-6 py-4 bg-background-neutral border-t border-border",
  },
  transition: {
    enterFromClass: "opacity-0 scale-95",
    enterActiveClass: "transition-all duration-200 ease-out",
    enterToClass: "opacity-100 scale-100",
    leaveFromClass: "opacity-100 scale-100",
    leaveActiveClass: "transition-all duration-150 ease-in",
    leaveToClass: "opacity-0 scale-95",
  },
}));

function onHide() {
  emit("update:visible", false);
  emit("hide");
}

function onShow() {
  emit("show");
}
</script>

<template>
  <Dialog
    :visible="visible"
    :closable="closable"
    :draggable="false"
    :modal="true"
    :pt="pt"
    :pt-options="{ mergeSections: false, mergeProps: false }"
    unstyled
    @update:visible="emit('update:visible', $event)"
    @hide="onHide"
    @show="onShow"
  >
    <template #container="{ closeCallback }">
      <div :class="panelClass">
        <div class="flex items-start justify-between gap-4 px-6 pt-6 pb-0">
          <div class="space-y-1">
            <h2 v-if="title" class="text-base font-medium leading-snug">
              {{ title }}
            </h2>
            <p v-if="description" class="text-sm text-text-muted">
              {{ description }}
            </p>
          </div>

          <button
            v-if="showClose && closable"
            class="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-lg text-text-muted hover:text-text-muted hover:bg-background-neutral transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-border -mt-0.5 cursor-pointer"
            aria-label="Close"
            @click="closeCallback"
          >
            <IconX size="18" stroke="2" />
          </button>
        </div>

        <div class="px-6 py-4 text-sm text-text-muted leading-relaxed">
          <slot />
        </div>

        <!-- Footer -->
        <div
          v-if="$slots.footer"
          class="flex items-center justify-end gap-2 px-6 py-4 bg-background-neutral border-t border-border"
        >
          <slot name="footer" :close="onHide" />
        </div>
      </div>
    </template>
  </Dialog>
</template>
