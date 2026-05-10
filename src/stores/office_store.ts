import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Office } from "@/types/office_types";

export const useOfficeStore = defineStore("office", () => {
  const offices = ref<Office[]>([]);
  const selectedOffice = ref<Office | null>(null);

  const activeOffices = computed(() => offices.value.filter((o) => o.is_active));

  const totalOffices = computed(() => offices.value.length);

  const setOffices = (newOffices: Office[]) => {
    offices.value = newOffices;
  };

  const setSelectedOffice = (office: Office | null) => {
    selectedOffice.value = office;
  };

  const addOffice = (office: Office) => {
    offices.value.push(office);
  };

  const updateOffice = (updated: Office) => {
    const index = offices.value.findIndex((o) => o.id === updated.id);
    if (index !== -1) offices.value[index] = updated;
    if (selectedOffice.value?.id === updated.id) {
      selectedOffice.value = updated;
    }
  };

  const removeOffice = (accessLink: string) => {
    offices.value = offices.value.filter((o) => o.access_link !== accessLink);
    if (selectedOffice.value?.access_link === accessLink) {
      selectedOffice.value = null;
    }
  };

  const clearOffices = () => {
    offices.value = [];
    selectedOffice.value = null;
  };

  return {
    offices,
    selectedOffice,
    activeOffices,
    totalOffices,
    setOffices,
    setSelectedOffice,
    addOffice,
    updateOffice,
    removeOffice,
    clearOffices,
  };
});
