<script setup lang="ts">
interface Props {
  visible: boolean;
  officeName?: string;
  loading?: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  (e: "update:visible", value: boolean): void;
  (e: "confirm"): void;
}>();
</script>

<template>
  <BaseDialog
    :visible="visible"
    title="Delete Office"
    description="This action cannot be undone."
    size="lg"
    @update:visible="emit('update:visible', $event)"
  >
    <div class="space-y-3">
      <p class="text-sm text-text">
        Are you sure you want to delete
        <span class="font-medium">{{ officeName }}</span
        >?
      </p>

      <p class="text-sm text-danger">
        All related feedback and settings may be permanently removed.
      </p>
    </div>

    <template #footer="{ close }">
      <BaseButton label="Cancel" variant="secondary" :disabled="loading" @click="close" />

      <BaseButton
        label="Delete Office"
        variant="danger"
        :loading="loading"
        :disabled="loading"
        @click="emit('confirm')"
      />
    </template>
  </BaseDialog>
</template>
