import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { createOffice } from "../api/office.api";
import { useOfficeStore } from "../stores/office.store";
import { OFFICE_KEYS } from "../use.office.key";
import type { CreateOfficePayload } from "../types/office.types";

export function useCreateOffice() {
  const queryClient = useQueryClient();
  const officeStore = useOfficeStore();

  const { mutate: createOfficeMutate, isPending } = useMutation({
    mutationFn: (payload: CreateOfficePayload) => createOffice(payload),
    onSuccess: (data) => {
      officeStore.addOffice(data);
      queryClient.invalidateQueries({ queryKey: OFFICE_KEYS.all });
    },
  });

  return { createOfficeMutate, isPending };
}
