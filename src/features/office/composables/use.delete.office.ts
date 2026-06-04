import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { deleteOffice } from "../api/office.api";
import { useOfficeStore } from "../stores/office.store";
import { getToast } from "@/lib/toast";
import { OFFICE_KEYS } from "../office.key";

export function useDeleteOffice() {
  const queryClient = useQueryClient();
  const officeStore = useOfficeStore();

  const { mutate: deleteOfficeMutate, isPending } = useMutation({
    mutationFn: (accessLink: string) => deleteOffice(accessLink),
    onSuccess: (_, accessLink) => {
      officeStore.removeOffice(accessLink);
      queryClient.invalidateQueries({ queryKey: OFFICE_KEYS.all });
      getToast().add({
        severity: "success",
        summary: "Office Deleted",
        detail: "The office has been deleted successfully.",
        life: 3000,
      });
    },
    onError: () => {
      getToast().add({
        severity: "error",
        summary: "Delete Failed",
        detail: "Unable to delete office.",
        life: 4000,
      });
    },
  });

  return { deleteOfficeMutate, isPending };
}
