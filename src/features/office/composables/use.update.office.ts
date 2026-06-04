import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { updateOffice } from "../api/office.api";
import { useOfficeStore } from "../stores/office.store";
import { OFFICE_KEYS } from "../office.key";
import type { UpdateOfficePayload } from "../types/office.types";
import { getToast } from "@/lib/toast";

export function useUpdateOffice() {
  const queryClient = useQueryClient();
  const officeStore = useOfficeStore();

  const { mutate: updateOfficeMutate, isPending } = useMutation({
    mutationFn: ({ accessLink, payload }: { accessLink: string; payload: UpdateOfficePayload }) =>
      updateOffice(accessLink, payload),
    onSuccess: (data, { accessLink }) => {
      officeStore.updateOffice(data);
      queryClient.invalidateQueries({ queryKey: OFFICE_KEYS.all });
      queryClient.invalidateQueries({ queryKey: OFFICE_KEYS.detail(accessLink) });

      getToast().add({
        severity: "success",
        summary: "Office updated",
        detail: "Your changes have been saved successfully.",
        life: 3000,
      });
    },
    onError: () => {
      getToast().add({
        severity: "error",
        summary: "Update failed",
        detail: "Something went wrong. Please try again.",
        life: 4000,
      });
    },
  });

  return { updateOfficeMutate, isPending };
}
