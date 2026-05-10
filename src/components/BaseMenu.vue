<script setup lang="ts">
import { ref, computed } from "vue";
import type { Component } from "vue";
import Menu from "primevue/menu";

export type MenuItem = {
  label?: string;
  icon?: Component;
  command?: () => void;
  separator?: boolean;
  disabled?: boolean;
};

const props = defineProps<{
  items: MenuItem[];
}>();

const menu = ref();

const toggle = (event: MouseEvent) => menu.value.toggle(event);

const model = computed(() => {
  const groups: { items?: any[]; separator?: boolean }[] = [];
  let current: any[] = [];

  for (const item of props.items) {
    if (item.separator) {
      if (current.length) groups.push({ items: current });
      groups.push({ separator: true });
      current = [];
    } else {
      current.push(item);
    }
  }

  if (current.length) groups.push({ items: current });
  return groups;
});

defineExpose({ toggle });
</script>

<template>
  <Menu
    ref="menu"
    :model="model"
    popup
    :pt="{
      root: { class: 'min-w-[180px] border-0 shadow-lg bg-white border border-border' },
      item: { class: 'rounded-lg' },
    }"
  >
    <template #item="{ item, props }">
      <a
        v-bind="props.action"
        class="flex items-center gap-2 px-3 py-2 text-sm"
        :class="
          item.disabled
            ? 'text-text-muted cursor-default pointer-events-none text-xs font-medium'
            : 'text-text'
        "
      >
        <component v-if="item.icon" :is="item.icon" :size="16" class="text-text-muted" />
        <span>{{ item.label }}</span>
      </a>
    </template>
  </Menu>
</template>
