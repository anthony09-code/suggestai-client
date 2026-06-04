import { ref, watch, type Ref } from "vue";
import type { Office } from "@/features/office/types/office.types";

export function useOfficeForm(office: Ref<Office | null | undefined>) {
  const officeName = ref("");
  const description = ref("");
  const isActive = ref(false);
  const selectedColor = ref<string | null>(null);
  const image = ref<string | null>(null);

  watch(
    office,
    (value) => {
      if (!value) return;
      officeName.value = value.office_name;
      description.value = value.description ?? "";
      selectedColor.value = value.color;
      isActive.value = value.is_active;
      image.value = value.image;
    },
    { immediate: true },
  );

  return { officeName, description, isActive, selectedColor, image };
}
