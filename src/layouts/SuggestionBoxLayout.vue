<script setup lang="ts">
import { IconSettings, IconTable, IconBox } from "@tabler/icons-vue";
import { computed } from "vue";
import { useBaseRouter } from "@/composables/use.router";
import { useOffices } from "@/features/office/composables/use.office";

const { params, path, push } = useBaseRouter();
const { data: offices } = useOffices();

const link = computed(() => params.value.accessLink as string);

const currentOffice = computed(() => offices.value?.find((o) => o.access_link === link.value));

const tabs = computed(() => {
  const base = `/offices/${link.value}`;
  return [
    // { label: "Overview", to: `${base}/overview` },
    { label: "Feedbacks", to: `${base}/feedbacks` },
    { label: "Sessions", to: `${base}/sessions` },
  ];
});

const selectedOffice = computed({
  get() {
    return currentOffice.value?.office_name ?? link.value;
  },
  set(val: string | null) {
    if (val) push(`/offices/${val}/overview`);
  },
});

const officeOptions = computed(
  () =>
    offices.value?.map((o) => ({
      label: o.office_name,
      value: o.access_link,
    })) ?? [],
);

const breadcrumbItems = computed(() => {
  const base = `/offices/${link.value}`;
  const isSettings = path.value === `${base}/settings`;
  const currentTab = tabs.value.find((t) => path.value === t.to);

  return [
    { label: "Offices", to: "/offices" },
    { label: currentOffice.value?.office_name ?? link.value, to: base },
    { label: isSettings ? "Settings" : (currentTab?.label ?? "Overview") },
  ];
});
</script>

<template>
  <div class="flex h-full gap-2">
    <aside class="w-60 shrink-0 bg-background border border-border rounded-2xl">
      <div class="border-b border-border px-4 py-3">
        <BaseDropdown
          v-model="selectedOffice"
          :options="officeOptions"
          optionLabel="label"
          optionValue="value"
          :icon="IconBox"
          placeholder="Select office"
          size="small"
          class="w-full"
        />
      </div>
      <nav class="flex flex-col px-4">
        <router-link
          :to="`/offices/${link}/settings`"
          class="flex items-center gap-2 rounded-lg my-4 px-2 py-1 hover:bg-muted"
          active-class="bg-text-muted/10"
          exact-active-class="bg-text-muted/10"
        >
          <IconSettings :size="14" />
          <span class="text-sm text-text">Settings</span>
        </router-link>
        <span class="text-xs text-text-muted font-medium mb-2">SUGGESTION BOX</span>
        <div
          class="flex items-center gap-2 bg-text-muted/10 px-2 py-1 rounded-lg cursor-pointer mb-2"
        >
          <IconTable :size="14" />
          <span class="text-sm text-text">{{ currentOffice?.office_name ?? link }}</span>
        </div>
        <router-link
          v-for="tab in tabs"
          :key="tab.to"
          :to="tab.to"
          class="flex items-center rounded-lg px-2 py-1 hover:bg-muted mb-1.5 ml-6"
          active-class="bg-text-muted/10 text-text"
          exact-active-class="bg-text-muted/10 text-text"
        >
          <span class="text-sm text-text">{{ tab.label }}</span>
        </router-link>
      </nav>
    </aside>
    <div class="flex-1 bg-background border border-border rounded-2xl overflow-auto">
      <div class="border-b border-border px-12 py-4 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <IconBox class="text-text-muted shrink-0" :size="18" />
          <BaseBreadcrumb :items="breadcrumbItems" />
        </div>
        <span class="text-sm text-text-muted">Last Activity: 2hours ago</span>
      </div>
      <main class="px-12 py-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>
