import { getToast } from "@/lib/toast";

const toast = getToast();

export function useCopyClipboard() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.add({
        severity: "success",
        // summary: "Copied",
        detail: "Text copied to clipboard",
        life: 3000,
      });
    });
  };

  return { copyToClipboard };
}
