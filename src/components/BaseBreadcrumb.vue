<script setup lang="ts">
defineProps<{
  items: {
    label: string;
    to?: string;
  }[];
}>();
</script>

<template>
  <nav class="flex items-center flex-wrap text-sm">
    <ol class="flex items-center flex-wrap gap-1">
      <li v-for="(item, i) in items" :key="i" class="flex items-center">
        <router-link
          v-if="item.to && i !== items.length - 1"
          :to="item.to"
          class="text-text-muted hover:text-text transition-colors"
        >
          {{ item.label }}
        </router-link>

        <span v-else class="text-text font-medium">
          {{ item.label }}
        </span>

        <span v-if="i !== items.length - 1" class="mx-2 text-text-muted"> / </span>
      </li>
    </ol>
  </nav>
</template>
