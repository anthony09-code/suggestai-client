<script setup lang="ts">
import InputText from "primevue/inputtext";

defineProps<{
  type?: string;
  placeholder?: string;
  modelValue?: string;
  disabled?: boolean;
  invalid?: boolean;
  size?: "small" | "large";
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const handleInput = (event: Event) => {
  emit("update:modelValue", (event.target as HTMLInputElement).value);
};
</script>

<template>
  <InputText
    :type="type ?? 'text'"
    :placeholder="placeholder"
    :value="modelValue"
    :disabled="disabled"
    :invalid="invalid"
    :size="size"
    :pt="{
      root: {
        class: [
          'w-full py-2 px-3 text-sm rounded-md outline-none',
          'text-text bg-background',
          'border border-border',
          'placeholder:text-text-muted',
          'transition-colors duration-150',
          'focus:border-text-muted',
          'disabled:bg-background-neutral disabled:text-text-muted disabled:cursor-not-allowed',
          invalid && 'border-danger',
        ],
      },
    }"
    @input="handleInput"
  />
</template>
