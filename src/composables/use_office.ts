import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { getOffices, getOffice, createOffice, updateOffice, deleteOffice } from "../api/office_api";
import { useOfficeStore } from "@/stores/office_store";
import type { CreateOfficePayload, UpdateOfficePayload } from "../types/office_types";

const OFFICE_KEYS = {
  all: ["offices"] as const,
  detail: (accessLink: string) => ["offices", accessLink] as const,
};

function useOfficeContext() {
  return {
    queryClient: useQueryClient(),
    officeStore: useOfficeStore(),
  };
}

export function useOffices() {
  const { officeStore } = useOfficeContext();

  return useQuery({
    queryKey: OFFICE_KEYS.all,
    queryFn: async () => {
      const data = await getOffices();
      officeStore.setOffices(data);
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useOffice(accessLink: string) {
  return useQuery({
    queryKey: OFFICE_KEYS.detail(accessLink),
    queryFn: () => getOffice(accessLink),
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateOffice() {
  const { queryClient, officeStore } = useOfficeContext();

  const { mutate: createOfficeMutate, isPending } = useMutation({
    mutationFn: (payload: CreateOfficePayload) => createOffice(payload),
    onSuccess: (data) => {
      officeStore.addOffice(data);
      queryClient.invalidateQueries({ queryKey: OFFICE_KEYS.all });
    },
  });

  return { createOfficeMutate, isPending };
}

export function useUpdateOffice() {
  const { queryClient, officeStore } = useOfficeContext();

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

export function useDeleteOffice() {
  const { queryClient, officeStore } = useOfficeContext();

  const { mutate: deleteOfficeMutate, isPending } = useMutation({
    mutationFn: (accessLink: string) => deleteOffice(accessLink),
    onSuccess: (_, accessLink) => {
      officeStore.removeOffice(accessLink);
      queryClient.invalidateQueries({ queryKey: OFFICE_KEYS.all });
    },
  });

  return { deleteOfficeMutate, isPending };
}
