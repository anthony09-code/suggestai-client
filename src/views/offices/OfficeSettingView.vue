<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { IconCopy } from "@tabler/icons-vue";
import { useBaseRouter } from "@/composables/use.router";
import { useOffice } from "@/features/office/composables/use.office";
import { useOfficeForm } from "@/composables/use.office-form";
import { useUpdateOffice } from "@/features/office/composables/use.update.office";
import { useDeleteOffice } from "@/features/office/composables/use.delete.office";
import { useCopyClipboard } from "@/composables/use.copy-clipboard";
import { downloadOfficeQr } from "@/features/office/api/office.api";
import DeleteOfficeDialog from "@/features/office/components/DeleteOfficeDialog.vue";
import { OFFICE_COLORS, COLOR_OPTIONS } from "@/constants/office.constants";

const BASE_URL = import.meta.env.VITE_API_URL;

const { params, push } = useBaseRouter();
const accessLink = computed(() => params.value.accessLink as string);

const { data: office, isPending: isOfficeLoading } = useOffice(accessLink.value);

const feedbackLink = computed(() =>
  office.value ? `${BASE_URL}/student/feedback/${office.value.access_link}` : "",
);

const qrCodeUrl = computed(() => office.value?.qr_code ?? null);

const { copyToClipboard } = useCopyClipboard();

const { updateOfficeMutate, isPending } = useUpdateOffice();

function handleSave() {
  updateOfficeMutate({
    accessLink: accessLink.value,
    payload: {
      name: officeName.value,
      description: description.value,
      is_active: isActive.value,
      color: selectedColor.value,
    },
  });
}

const deleteDialogVisible = ref(false);

const { deleteOfficeMutate, isPending: isDeleting } = useDeleteOffice();

function handleDelete() {
  deleteOfficeMutate(accessLink.value, {
    onSuccess: () => {
      deleteDialogVisible.value = false;

      push("/offices");
    },
  });
}

async function downloadQrCode() {
  if (!office.value) return;

  try {
    const blob = await downloadOfficeQr(office.value.access_link);

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = `${office.value.access_link}-qr.svg`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error(error);
  }
}


const { officeName, description, isActive, selectedColor } = useOfficeForm(office);

watch(
  office,
  (v) => {
    console.log("OFFICE FULL:", v);
    console.log("QR FIELD:", v?.qr_code);
  },
  { immediate: true },
);
</script>

<template>
  <div class="max-w-4xl space-y-10">
    <h2 class="text-xl font-medium">Settings</h2>

    <section class="grid grid-cols-[120px_1fr] gap-20">
      <h2 class="text-xl">View</h2>

      <div class="flex flex-col gap-10">
        <div class="flex flex-col gap-2 flex-1">
          <label class="text-sm">Access Link</label>

          <div class="flex gap-1">
            <BaseInput :model-value="feedbackLink" readonly class="flex-1" />
            <BaseButton variant="neutral" @click="copyToClipboard(feedbackLink ?? '')">
              <IconCopy :size="18" stroke="2" />
            </BaseButton>
          </div>
        </div>

        <!-- QR CODE -->
        <div class="flex flex-col gap-2 flex-1">
          <label class="text-sm">QR Code</label>

          <div class="flex gap-2">
            <template v-if="isOfficeLoading">
              <BaseSkeleton width="320px" height="320px" />
            </template>

            <template v-else>
              <img
                v-if="qrCodeUrl"
                :src="qrCodeUrl"
                alt="QR Code"
                class="w-80 h-80 rounded-lg border border-border object-contain"
              />

              <p v-else class="text-sm text-text-muted">No QR code generated yet.</p>

              <BaseButton
                variant="neutral"
                label="Download PNG"
                class="self-start"
                @click="downloadQrCode"
              />
            </template>
          </div>
        </div>
      </div>
    </section>

    <hr class="border-border" />

    <section class="grid grid-cols-[120px_1fr] gap-20 items-start">
      <h2 class="text-xl">Update</h2>

      <div class="flex flex-col gap-10">
        <!-- Image Upload -->
        <!-- <div>
          <div
            v-if="previewUrl"
            class="relative h-48 rounded-xl overflow-hidden border border-surface-200 group"
          >
            <img :src="previewUrl" alt="Office preview" class="w-full h-full object-cover" />

            <div
              class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2"
            >
              <Button label="Change" size="small" severity="secondary" @click="triggerInput" />
              <Button label="Remove" size="small" severity="danger" @click="clearImage" />
            </div>
          </div>

          <div
            v-else
            @click="triggerInput"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="onDrop"
            :class="[
              'h-36 rounded-xl border-2 border-dashed transition-colors cursor-pointer flex flex-col items-center justify-center gap-2',
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-surface-300 bg-surface-50 hover:border-surface-400',
            ]"
          >
            <i class="pi pi-upload text-surface-400 text-xl" />
            <p class="text-sm text-surface-500">
              Click to upload <span class="text-surface-400">or drag and drop</span>
            </p>
            <p class="text-xs text-surface-400">PNG, JPG, WEBP up to 5MB</p>
          </div>

          <input
            ref="inputRef"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            class="hidden"
            @change="onFileChange"
          />

          <Message v-if="error" severity="error" size="small" variant="simple" class="mt-1.5">
            {{ error }}
          </Message>
        </div> -->

        <div class="flex flex-col gap-2">
          <label class="text-sm">Office Name</label>

          <div class="flex items-center gap-1">
            <BaseDropdown
              v-model="selectedColor"
              :options="COLOR_OPTIONS"
              placeholder="Pick a color..."
            >
              <template #menu="{ close }">
                <div class="grid grid-cols-5 gap-1.5 p-2">
                  <button
                    v-for="color in OFFICE_COLORS"
                    :key="color"
                    type="button"
                    class="w-7 h-7 rounded-full transition-all duration-150"
                    :style="{
                      backgroundColor: color,
                      boxShadow:
                        selectedColor === color
                          ? `0 0 0 2px var(--color-background), 0 0 0 3.5px ${color}`
                          : 'none',
                    }"
                    @click="
                      () => {
                        selectedColor = color;
                        close();
                      }
                    "
                  />
                </div>
              </template>
            </BaseDropdown>

            <BaseInput v-model="officeName" class="flex-1" />
          </div>
        </div>

        <!-- Description -->
        <div class="flex flex-col gap-2">
          <label class="text-sm">Description</label>

          <textarea
            v-model="description"
            rows="5"
            class="w-full py-2 px-3 text-sm text-text bg-background rounded-md border border-border focus:border-text-muted outline-none"
          />
        </div>

        <!-- Active Status -->
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium">Active Status</p>
            <p class="text-sm text-text-muted">
              {{ isActive ? "Office is currently active" : "Office is currently inactive" }}
            </p>
          </div>

          <button
            type="button"
            @click="isActive = !isActive"
            class="relative w-11 h-6 rounded-full transition-colors duration-200"
            :class="isActive ? 'bg-primary' : 'bg-border'"
          >
            <span
              class="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200"
              :class="isActive ? 'translate-x-5' : 'translate-x-0'"
            />
          </button>
        </div>

        <BaseButton
          type="button"
          label="Save Changes"
          class="self-start"
          :loading="isPending"
          :disabled="isPending"
          @click="handleSave"
        />
      </div>
    </section>

    <hr class="border-border" />

    <!-- Delete -->
    <section class="grid grid-cols-[120px_1fr] gap-20 items-start">
      <h2 class="text-xl font-medium">Delete</h2>

      <div class="space-y-10">
        <p class="text-sm text-text-muted">
          Deleting this office will permanently remove it along with all associated data. This
          action cannot be undone.
        </p>

        <BaseButton
          variant="danger"
          label="Delete Office"
          :loading="isDeleting"
          @click="deleteDialogVisible = true"
        />
      </div>
    </section>
  </div>
  <DeleteOfficeDialog
    v-model:visible="deleteDialogVisible"
    :office-name="office?.office_name"
    :loading="isDeleting"
    @confirm="handleDelete"
  />
</template>
