<script setup lang="ts">
import { IconX } from "@tabler/icons-vue";

defineProps<{
  visible: boolean;
}>();

defineEmits<{
  clear: [];
}>();
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-150 ease-out"
    enter-from-class="opacity-0 -translate-x-1"
    enter-to-class="opacity-100 translate-x-0"
    leave-active-class="transition-all duration-100 ease-in"
    leave-from-class="opacity-100 translate-x-0"
    leave-to-class="opacity-0 -translate-x-1"
  >
    <button
      v-if="visible"
      type="button"
      class="flex items-center gap-1.5 px-3 py-2 text-sm text-text-muted hover:text-text hover:bg-muted transition-colors duration-150 whitespace-nowrap cursor-pointer"
      @click="$emit('clear')"
    >
      <IconX :size="13" />
      Clear
    </button>
  </Transition>
</template>
