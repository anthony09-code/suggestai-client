<script lang="ts" setup>
import { IconAlertCircleFilled } from "@tabler/icons-vue";

interface Props {
  code?: string;
  title: string;
  message: string;
  buttonLabel?: string;
  showButton?: boolean;
}

withDefaults(defineProps<Props>(), {
  code: "404",
  showButton: true,
  buttonLabel: "Go Back",
});
</script>

<template>
  <main class="flex min-h-screen items-center justify-center px-4">
    <div class="flex flex-col items-center text-center">
      <div class="bg-text-muted/10 mb-4 rounded-full p-4">
        <IconAlertCircleFilled class="text-text-muted" size="22" />
      </div>

      <h1 class="text-xl font-medium">{{ code }} - {{ title }}</h1>

      <p class="text-text-muted mt-2 text-base">
        {{ message }}
      </p>

      <BaseButton v-if="showButton" :label="buttonLabel" variant="primary" size="sm" class="mt-6" />
    </div>
  </main>
</template>
