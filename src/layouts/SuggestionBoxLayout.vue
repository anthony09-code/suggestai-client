<script setup lang="ts">
import { IconSettings, IconTable, IconBox } from "@tabler/icons-vue";
import Breadcrumb from "primevue/breadcrumb";
import { useRoute, useRouter } from "vue-router";
import { computed } from "vue";
import { useOffices } from "@/composables/use_office";

const route = useRoute();
const router = useRouter();
const { data: offices } = useOffices();

const link = computed(() => route.params.link as string);

const currentOffice = computed(() =>
  offices.value?.find((o) => o.id === link.value || o.link === link.value),
);

const tabs = computed(() => {
  const base = `/offices/${link.value}`;
  return [
    { label: "Overview", to: base, exact: true },
    { label: "Suggestions", to: `${base}/suggestions` },
    { label: "Summary", to: `${base}/summary` },
  ];
});

const selectedOffice = computed({
  get() {
    return link.value ?? null;
  },
  set(val: string | null) {
    if (val) router.push(`/offices/${val}`);
  },
});

const officeOptions = computed(
  () => offices.value?.map((o) => ({ label: o.office_name, value: o.id })) ?? [],
);

const breadcrumbItems = computed(() => {
  const base = `/offices/${link.value}`;
  const currentTab = tabs.value.find((t) => route.path === t.to);
  return [
    { label: "Offices", to: "/offices" },
    { label: currentOffice.value?.office_name ?? link.value, to: base },
    { label: currentTab?.label ?? "Overview" },
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
        />
      </div>
      <nav class="flex flex-col px-4">
        <router-link
          to="settings"
          class="flex items-center gap-2 rounded-lg my-4 px-2 py-1 hover:bg-muted"
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
        >
          <span class="text-sm text-text">{{ tab.label }}</span>
        </router-link>
      </nav>
    </aside>
    <div class="flex-1 bg-background border border-border rounded-2xl overflow-auto">
      <div class="border-b border-border px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <IconBox class="text-text-muted shrink-0" :size="18" />
          <Breadcrumb
            :model="breadcrumbItems"
            unstyled
            :pt="{
              root: { class: 'flex items-center' },
              menu: { class: 'flex items-center flex-wrap' },
              menuitem: { class: 'flex items-center' },
              separator: { class: 'flex items-center' },
            }"
          >
            <template #item="{ item, props }">
              <router-link
                v-if="item.to"
                v-bind="props.action"
                :to="item.to"
                class="text-sm text-text-muted hover:text-text transition-colors"
              >
                {{ item.label }}
              </router-link>

              <span v-else class="text-sm text-text font-medium">
                {{ item.label }}
              </span>
            </template>

            <template #separator>
              <span class="mx-2 text-text-muted">/</span>
            </template>
          </Breadcrumb>
        </div>
        <span class="text-sm text-text-muted">Last Activity: 2hours ago</span>
      </div>
      <div class="p-12">
        <RouterView />
      </div>
    </div>
  </div>
</template>
