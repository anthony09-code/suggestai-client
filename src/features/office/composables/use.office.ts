import { useQuery, keepPreviousData } from "@tanstack/vue-query";
import { getOffice, getOffices } from "../api/office.api";
import { useOfficeStore } from "../stores/office.store";
import { OFFICE_KEYS } from "../office.key";

export function useOffices() {
  const officeStore = useOfficeStore();

  return useQuery({
    queryKey: OFFICE_KEYS.all,
    queryFn: async () => {
      const data = await getOffices();
      officeStore.setOffices(data);
      return data;
    },
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });
}

export function useOffice(accessLink: string) {
  const officeStore = useOfficeStore();

  return useQuery({
    queryKey: OFFICE_KEYS.detail(accessLink),
    queryFn: () => getOffice(accessLink),
    staleTime: 1000 * 60 * 5,
    placeholderData: () => officeStore.offices.find((o) => o.access_link === accessLink),
  });
}
