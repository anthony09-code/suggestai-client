export const OFFICE_COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#f43f5e",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#14b8a6",
];

export const COLOR_OPTIONS = OFFICE_COLORS.map((color) => ({
  label: color,
  value: color,
  color: color,
}));

export const MAX_SIZE_MB = 5;
export const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];
