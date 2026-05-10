<script setup lang="ts">
import VueWordCloud from "vuewordcloud";
import { computed } from "vue";

type WordItem = [string, number] | { text: string; weight: number };

const props = defineProps<{
  words: WordItem[];
  title?: string;
  subtitle?: string;
  height?: string;
  color?: string[];
}>();

const normalizedWords = computed(() =>
  props.words.map((w) => (Array.isArray(w) ? w : [w.text, w.weight])),
);
</script>

<template>
  <div class="w-full">
    <div v-if="title || subtitle" class="mb-4">
      <p v-if="title" class="text-sm font-medium text-text">
        {{ title }}
      </p>
      <p v-if="subtitle" class="text-xs text-text-muted">
        {{ subtitle }}
      </p>
    </div>

    <div :style="{ height: height || '300px' }" class="w-full">
      <VueWordCloud
        :words="normalizedWords"
        :color="
          color || [
            'var(--color-primary)',
            'var(--color-primary-strong)',
            'var(--color-warning)',
            'var(--color-danger)',
            'var(--color-text)',
            'var(--color-text-muted)',
          ]
        "
        font-family="Poppins, sans-serif"
      />
    </div>
  </div>
</template>
