import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { updateOffice } from "../api/office.api";
import { useOfficeStore } from "../stores/office.store";
import { OFFICE_KEYS } from "../use.office.key";
import type { UpdateOfficePayload } from "../types/office.types";

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
    },
  });

  return { updateOfficeMutate, isPending };
}
