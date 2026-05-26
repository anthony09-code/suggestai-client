import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { deleteOffice } from "../api/office.api";
import { useOfficeStore } from "../stores/office.store";
import { OFFICE_KEYS } from "../use.office.key";

export function useDeleteOffice() {
  const queryClient = useQueryClient();
  const officeStore = useOfficeStore();

  const { mutate: deleteOfficeMutate, isPending } = useMutation({
    mutationFn: (accessLink: string) => deleteOffice(accessLink),
    onSuccess: (_, accessLink) => {
      officeStore.removeOffice(accessLink);
      queryClient.invalidateQueries({ queryKey: OFFICE_KEYS.all });
    },
  });

  return { deleteOfficeMutate, isPending };
}
