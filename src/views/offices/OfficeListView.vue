<script lang="ts" setup>
import { ref, computed } from "vue";
import { useOffices } from "@/features/office/composables/use.office";
import { useBaseRouter } from "@/composables/use.router";
import CreateOfficeDialog from "@/features/office/components/CreateOfficeDialog.vue";

const { data: offices, isLoading, isError, refetch } = useOffices();
const officeCount = computed(() => offices.value?.length || 5);
const { router } = useBaseRouter();

const showCreateDialog = ref(false);

function onOfficeCreated() {
  refetch();
}
</script>

<template>
  <main>
    <div class="flex items-center justify-between mb-8">
      <h2 class="text-xl font-medium">All Offices/Departments</h2>
      <BaseButton
        label="Create Box"
        variant="primary"
        size="small"
        @click="showCreateDialog = true"
      />
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
        <BaseCard v-for="n in officeCount" :key="n" class="cursor-pointer">
          <BaseSkeleton height="16px" width="55%" />
          <div class="mt-3 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <BaseSkeleton height="8px" width="8px" shape="circle" />
              <BaseSkeleton height="12px" width="48px" />
            </div>
            <BaseSkeleton height="12px" width="80px" />
          </div>
        </BaseCard>
      </template>
      <template v-else>
        <BaseCard
          v-for="office in offices"
          :key="office.id"
          class="cursor-pointer"
          @click="router.push(`/offices/${office.access_link}/feedbacks`)"
        >
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

    <!-- Create Office Dialog -->
    <CreateOfficeDialog v-model:visible="showCreateDialog" @created="onOfficeCreated" />
  </main>
</template>
