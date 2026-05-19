export const OFFICE_KEYS = {
  all: ["offices"] as const,
  detail: (accessLink: string) => ["offices", accessLink] as const,
};
