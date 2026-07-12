<script setup lang="ts">
import { reactive } from "vue";
import { IconBuilding, IconToggleLeft } from "@tabler/icons-vue";
import { useCreateOffice } from "@/features/office/composables/use.create.office";

interface Props {
  visible: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  (e: "update:visible", value: boolean): void;
  (e: "created"): void;
}>();

const { createOfficeMutate, isPending } = useCreateOffice();

const form = reactive({
  office_name: "",
  description: "",
  is_active: true,
});

const errors = reactive({
  office_name: "",
});

function validate() {
  errors.office_name = "";

  if (!form.office_name.trim()) {
    errors.office_name = "Office name is required.";
    return false;
  }

  return true;
}

async function onSubmit() {
  if (!validate()) return;

  createOfficeMutate(
    {
      office_name: form.office_name,
      description: form.description || undefined,
      is_active: form.is_active,
    },
    {
      onSuccess: () => {
        emit("created");
        emit("update:visible", false);
        resetForm();
      },
      onError: (error) => {
        console.error(error);
      },
    },
  );
}

function resetForm() {
  form.office_name = "";
  form.description = "";
  form.is_active = true;

  errors.office_name = "";
}

function onHide() {
  resetForm();
}
</script>

<template>
  <BaseDialog
    :visible="visible"
    title="Create Office / Department"
    description="Add a new office or department to the suggestion box system."
    size="lg"
    @update:visible="emit('update:visible', $event)"
    @hide="onHide"
  >
    <div class="space-y-4 pt-1">
      <!-- Office Name -->
      <div class="space-y-1.5">
        <label class="text-xs font-medium text-text flex items-center gap-1.5">
          <IconBuilding size="13" stroke="2" class="text-text-muted" />
          Office / Department Name
          <span class="text-red-500">*</span>
        </label>

        <input
          v-model="form.office_name"
          type="text"
          placeholder="e.g. Human Resources"
          class="w-full rounded-lg border px-3 py-2 text-sm text-text placeholder:text-text-muted bg-white transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-0"
          :class="
            errors.office_name
              ? 'border-red-400 focus:ring-red-300'
              : 'border-border focus:ring-border'
          "
        />

        <p v-if="errors.office_name" class="text-xs text-red-500">
          {{ errors.office_name }}
        </p>
      </div>

      <!-- Description -->
      <div class="space-y-1.5">
        <label class="text-xs font-medium text-text">
          Description
          <span class="text-text-muted">(optional)</span>
        </label>

        <textarea
          v-model="form.description"
          rows="3"
          placeholder="Enter office description..."
          class="w-full rounded-lg border border-border px-3 py-2 text-sm text-text placeholder:text-text-muted bg-white resize-none focus:outline-none focus:ring-2 focus:ring-border"
        />
      </div>

      <!-- Active Toggle -->
      <div
        class="flex items-center justify-between rounded-lg border border-border px-3 py-2.5 bg-background-neutral/50"
      >
        <div class="flex items-center gap-2">
          <IconToggleLeft size="15" stroke="2" class="text-text-muted" />
          <span class="text-sm text-text">Active</span>
        </div>

        <button
          type="button"
          role="switch"
          :aria-checked="form.is_active"
          class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-border focus:ring-offset-1"
          :class="form.is_active ? 'bg-green-500' : 'bg-border'"
          @click="form.is_active = !form.is_active"
        >
          <span
            class="pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform ring-0 transition-transform duration-200 ease-in-out"
            :class="form.is_active ? 'translate-x-4' : 'translate-x-0'"
          />
        </button>
      </div>
    </div>

    <template #footer="{ close }">
      <BaseButton
        label="Cancel"
        variant="secondary"
        size="small"
        :disabled="isPending"
        @click="close"
      />
      <BaseButton
        label="Create Office"
        variant="primary"
        size="small"
        :loading="isPending"
        :disabled="isPending"
        @click="onSubmit"
      />
    </template>
  </BaseDialog>
</template>
