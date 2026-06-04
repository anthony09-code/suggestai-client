import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { createOffice } from "../api/office.api";
import { useOfficeStore } from "../stores/office.store";
import { getToast } from "@/lib/toast";
import { OFFICE_KEYS } from "../office.key";
import type { CreateOfficePayload } from "../types/office.types";

export function useCreateOffice() {
  const queryClient = useQueryClient();
  const officeStore = useOfficeStore();

  const { mutate: createOfficeMutate, isPending } = useMutation({
    mutationFn: (payload: CreateOfficePayload) => createOffice(payload),
    onSuccess: (data) => {
      officeStore.addOffice(data);
      queryClient.invalidateQueries({ queryKey: OFFICE_KEYS.all });
      getToast().add({
        severity: "success",
        summary: "Office Created",
        detail: `${data.office_name} has been created successfully.`,
        life: 3000,
      });
    },
    onError: (error: any) => {
      getToast().add({
        severity: "error",
        summary: "Creation Failed",
        detail: error?.response?.data?.message ?? "Unable to create office. Please try again.",
        life: 5000,
      });
    },
  });

  return { createOfficeMutate, isPending };
}
