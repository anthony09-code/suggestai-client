import { ref } from "vue";
import { MAX_SIZE_MB, ACCEPTED_IMAGE_TYPES } from "@/constants/office.constants";

export function useImageUpload() {
  const inputRef = ref<HTMLInputElement | null>(null);
  const previewUrl = ref<string | null>(null);
  const isDragging = ref(false);
  const error = ref<string | null>(null);
  const selectedFile = ref<File | null>(null);

  function triggerInput() {
    inputRef.value?.click();
  }

  function onFileChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) processFile(file);
  }

  function onDrop(e: DragEvent) {
    isDragging.value = false;
    const file = e.dataTransfer?.files?.[0];
    if (file) processFile(file);
  }

  function processFile(file: File) {
    error.value = null;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      error.value = "Only PNG, JPG, and WEBP images are allowed.";
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      error.value = `Image must be smaller than ${MAX_SIZE_MB}MB.`;
      return;
    }

    selectedFile.value = file;
    previewUrl.value = URL.createObjectURL(file);
  }

  function clearImage() {
    previewUrl.value = null;
    selectedFile.value = null;
    error.value = null;
    if (inputRef.value) inputRef.value.value = "";
  }

  return {
    inputRef,
    previewUrl,
    isDragging,
    error,
    selectedFile,
    triggerInput,
    onFileChange,
    onDrop,
    clearImage,
  };
}
