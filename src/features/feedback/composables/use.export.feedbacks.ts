import { ref } from "vue";
import { exportFeedbacks } from "../api/feedback.api";
import type { FeedbackParams } from "../types/feedback.types";

type ExportFormat = "csv" | "excel" | "pdf";

export function useExportFeedbacks(accessLink: string) {
  const isExporting = ref(false);

  async function exportFile(format: ExportFormat, params?: FeedbackParams) {
    isExporting.value = true;

    try {
      const response = await exportFeedbacks(accessLink, format, params);

      const ext = format === "excel" ? "xlsx" : format;
      const contentDisposition = response.headers["content-disposition"];
      const filename = contentDisposition
        ? contentDisposition.split("filename=")[1].replace(/"/g, "")
        : `feedbacks-${accessLink}.${ext}`;

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } finally {
      isExporting.value = false;
    }
  }

  return { exportFile, isExporting };
}
