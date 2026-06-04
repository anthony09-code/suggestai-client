export const SESSION_KEYS = {
  all: ["sessions"] as const,
  lists: () => [...SESSION_KEYS.all, "list"] as const,
  list: (page: number, perPage: number, status?: string) =>
    [...SESSION_KEYS.lists(), { page, perPage, status }] as const,
  byOffice: (accessLink: string) => [...SESSION_KEYS.all, "office", accessLink] as const,
  byOfficeLists: (accessLink: string) => [...SESSION_KEYS.byOffice(accessLink), "list"] as const,
  byOfficeList: (accessLink: string, page: number, perPage: number, status?: string) =>
    [...SESSION_KEYS.byOfficeLists(accessLink), { page, perPage, status }] as const,
  detail: (id: string) => [...SESSION_KEYS.all, id] as const,
  stats: () => [...SESSION_KEYS.all, "stats"] as const,
};
