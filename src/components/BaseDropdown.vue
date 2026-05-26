<script setup lang="ts">
import { type Component, computed, ref, onMounted, onUnmounted } from "vue";
import { IconChevronDown, IconCheck } from "@tabler/icons-vue";

type Option = {
  label: string;
  value: string | number;
  icon?: Component;
};

type Size = "small" | "medium" | "large";

const props = withDefaults(
  defineProps<{
    modelValue: Option["value"] | null;
    options: Option[];
    optionLabel?: keyof Option;
    optionValue?: keyof Option;
    placeholder?: string;
    icon?: Component;
    size?: Size;
  }>(),
  {
    size: "medium",
  },
);

const emit = defineEmits<{
  (e: "update:modelValue", value: Option["value"] | null): void;
}>();

const open = ref(false);
const rootRef = ref<HTMLElement | null>(null);

const value = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

const labelKey = computed(() => props.optionLabel ?? "label");
const valueKey = computed(() => props.optionValue ?? "value");

const selectedOption = computed(() => props.options.find((o) => o[valueKey.value] === value.value));

const sizeClasses = computed(() => {
  switch (props.size) {
    case "small":
      return {
        trigger: "px-2.5 py-1 text-sm rounded-md",
        item: "px-2.5 py-1.5 text-sm",
        icon: 14,
        chevron: 13,
      };

    case "large":
      return {
        trigger: "py-2 px-3 text-sm rounded-md",
        item: "px-3 py-3 text-sm",
        icon: 18,
        chevron: 16,
      };

    default:
      return {
        trigger: "px-3 py-2 text-sm rounded-md",
        item: "px-3 py-2 text-sm",
        icon: 16,
        chevron: 15,
      };
  }
});

function select(option: Option) {
  value.value = option[valueKey.value] as Option["value"];
  open.value = false;
}

function onClickOutside(e: MouseEvent) {
  if (rootRef.value && !rootRef.value.contains(e.target as Node)) {
    open.value = false;
  }
}

onMounted(() => document.addEventListener("mousedown", onClickOutside));
onUnmounted(() => document.removeEventListener("mousedown", onClickOutside));
</script>

<template>
  <div ref="rootRef" class="relative">
    <button
      type="button"
      class="w-full flex items-center gap-2 border border-border bg-background hover:border-text-muted transition-colors duration-150 cursor-pointer"
      :class="sizeClasses.trigger"
      @click="open = !open"
    >
      <component v-if="icon" :is="icon" :size="sizeClasses.icon" class="text-text-muted shrink-0" />

      <span v-if="selectedOption" class="flex-1 text-left text-text truncate capitalize">
        {{ selectedOption[labelKey] }}
      </span>

      <span v-else class="flex-1 text-left text-text-muted truncate">
        {{ placeholder ?? "Select..." }}
      </span>

      <IconChevronDown
        :size="sizeClasses.chevron"
        class="text-text-muted shrink-0 transition-transform duration-150"
        :class="{ 'rotate-180': open }"
      />
    </button>

    <Transition
      enter-active-class="transition-all duration-150 ease-out"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-100 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <ul
        v-if="open"
        class="absolute left-0 top-full z-50 mt-1 w-full rounded-xl border border-border bg-background py-1 overflow-hidden"
      >
        <li
          v-for="option in options"
          :key="String(option[valueKey])"
          class="flex items-center gap-2 text-text hover:bg-background cursor-pointer transition-colors duration-150"
          :class="sizeClasses.item"
          @click="select(option)"
        >
          <component
            v-if="option.icon"
            :is="option.icon"
            :size="sizeClasses.icon"
            class="text-text-muted shrink-0"
          />

          <span class="flex-1 truncate">
            {{ option[labelKey] }}
          </span>

          <IconCheck
            v-if="option[valueKey] === value"
            :size="sizeClasses.icon"
            class="text-text-muted shrink-0"
          />
        </li>

        <li v-if="options.length === 0" class="px-3 py-2 text-sm text-text-muted">No options</li>
      </ul>
    </Transition>
  </div>
</template>
