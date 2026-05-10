<script setup lang="ts">
import Dropdown from "primevue/dropdown";
import { type Component, computed } from "vue";

type Option = {
  label: string;
  value: string | number;
  icon?: Component;
};

const props = defineProps<{
  modelValue: Option["value"] | null;
  options: Option[];
  optionLabel?: keyof Option;
  optionValue?: keyof Option;
  placeholder?: string;
  icon?: Component;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: Option["value"] | null): void;
}>();

const value = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});
</script>

<template>
  <Dropdown
    v-model="value"
    :appendTo="'self'"
    :options="options"
    :optionLabel="optionLabel"
    :optionValue="optionValue"
    :placeholder="placeholder"
    class="w-full"
    unstyled
    :pt="{
      root: {
        class:
          'w-full relative flex items-center rounded-lg border border-border text-sm hover:border-text-muted transition-colors duration-150',
      },
      inputcontainer: {
        class: 'w-full flex items-center px-3 py-2 bg-background rounded-lg cursor-pointer',
      },
      label: {
        class: 'text-text truncate flex-1',
      },
      trigger: {
        class: 'text-text-muted hover:text-text ml-2',
      },
      panel: {
        class:
          'absolute left-0 top-full w-full mt-1 rounded-xl border border-border bg-background shadow-lg z-50',
      },
      list: {
        class: 'py-1 bg-background w-full overflow-hidden rounded-xl',
      },
      item: {
        class: 'px-3 py-2 text-sm text-text hover:bg-muted cursor-pointer transition-colors w-full',
      },
      itemGroup: {
        class: 'px-3 py-2 text-xs font-semibold text-text-muted bg-muted/40',
      },
    }"
  >
    <template #value="{ value }">
      <div v-if="value" class="flex items-center gap-2">
        <component v-if="icon" :is="icon" class="text-text-muted" :size="16" />
        <span class="font-semibold capitalize">
          {{ value?.[optionLabel || "label"] ?? value }}
        </span>
      </div>
      <span v-else class="text-text-muted">
        {{ placeholder || "Select..." }}
      </span>
    </template>

    <template #option="{ option }">
      <div class="flex items-center gap-2">
        <component v-if="icon" :is="icon" class="text-text-muted" :size="16" />
        <span>{{ option?.[optionLabel || "label"] }}</span>
      </div>
    </template>
  </Dropdown>
</template>
