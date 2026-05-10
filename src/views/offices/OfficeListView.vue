<script lang="ts" setup>
import { useOffices } from "@/composables/use_office";
import { ref, watch } from "vue";

const { data: offices, isLoading, isError } = useOffices();

const cachedCount = ref(0);

watch(offices, (val) => {
  if (val?.length) cachedCount.value = val.length;
});
</script>

<template>
  <main>
    <div class="flex items-center justify-between mb-8">
      <h2 class="text-xl font-medium">All Offices/Departments</h2>
      <BaseButton label="Create Box" variant="primary" size="sm" />
    </div>
    <span class="text-base text-text-muted">Suggestion Box:</span>
    <BaseMessage
      v-if="isError || (!isLoading && !offices?.length)"
      :severity="isError ? 'error' : 'warn'"
      :text="
        isError
          ? 'Failed to load offices. Please try again.'
          : 'No offices found. Create one to get started.'
      "
      class="mt-6"
    />

    <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
      <template v-if="isLoading">
        <BaseCard v-for="n in cachedCount || 8" :key="n" :loading="true" />
      </template>
      <template v-else>
        <BaseCard v-for="office in offices" :key="office.id" class="cursor-pointer">
          <p class="text-base font-medium text-text">{{ office.office_name }}</p>
          <div class="mt-3 flex items-center justify-between text-sm">
            <div class="flex items-center gap-2">
              <span
                class="w-1 h-1 rounded-full"
                :class="office.is_active ? 'bg-green-500' : 'bg-red-500'"
              />
              <span class="text-xs font-medium text-text-muted">
                {{ office.is_active ? "Active" : "Inactive" }}
              </span>
            </div>
            <span class="text-text-muted text-xs">{{ office.access_link }}</span>
          </div>
        </BaseCard>
      </template>
    </div>
  </main>
</template>
