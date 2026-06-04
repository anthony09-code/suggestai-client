export const dateOptions = [
  {
    label: "All Time",
    value: "all",
  },
  {
    label: "Today",
    value: "today",
  },
  {
    label: "Last 7 Days",
    value: "7days",
  },
  {
    label: "Last 30 Days",
    value: "30days",
  },
  {
    label: "Last 90 Days",
    value: "90days",
  },
  {
    label: "Week to Date",
    value: "wtd",
  },
  {
    label: "Month to Date",
    value: "mtd",
  },
  {
    label: "Quarter to Date",
    value: "qtd",
  },
  {
    label: "Year to Date",
    value: "ytd",
  },
] as const;

export const anonymousOptions = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Anonymous",
    value: "anonymous",
  },
  {
    label: "Identified",
    value: "identified",
  },
] as const;

export const statusOptions = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Pending",
    value: "pending",
  },
  {
    label: "Processed",
    value: "processed",
  },
] as const;

export const exportOptions = [
  {
    label: "Csv",
    value: "csv",
  },
  {
    label: "Excel",
    value: "excel",
  },
  {
    label: "Pdf",
    value: "pdf",
  },
] as const;
