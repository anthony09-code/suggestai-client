<script lang="ts" setup>
import Toast from "primevue/toast";
import ProgressBar from "primevue/progressbar";
import type { ToastMessageOptions } from "primevue/toast";
import {
  IconCircleCheck,
  IconInfoCircle,
  IconAlertTriangle,
  IconCircleX,
  IconLoader2,
  IconX,
  IconPencilFilled,
} from "@tabler/icons-vue";
import { type Component } from "vue";

type Severity = "success" | "info" | "warn" | "error" | "secondary";

const severityMap: Record<
  Severity,
  {
    icon: Component;
    border: string;
    iconColor: string;
    textColor: string;
    bg: string;
    loading?: boolean;
  }
> = {
  success: {
    icon: IconCircleCheck,
    border: "border-l-primary",
    iconColor: "text-primary",
    textColor: "text-primary",
    bg: "bg-green-50",
  },
  info: {
    icon: IconInfoCircle,
    border: "border-l-blue-500",
    iconColor: "text-blue-500",
    textColor: "text-blue-700",
    bg: "bg-blue-50",
  },
  warn: {
    icon: IconAlertTriangle,
    border: "border-l-warning",
    iconColor: "text-warning",
    textColor: "text-warning",
    bg: "bg-yellow-50",
  },
  error: {
    icon: IconCircleX,
    border: "border-l-danger",
    iconColor: "text-danger",
    textColor: "text-danger",
    bg: "bg-red-50",
  },
  secondary: {
    icon: IconLoader2,
    border: "border-l-gray-400",
    iconColor: "text-text-muted",
    textColor: "text-text-muted",
    bg: "bg-gray-50",
    loading: true,
  },
};

const getSeverity = (message: ToastMessageOptions) =>
  severityMap[(message.severity as Severity) ?? "info"];

const props = defineProps<{ progress?: number }>();
</script>

<template>
  <Toast
    position="top-center"
    :pt="{
      root: {
        class: 'fixed top-2 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-4 w-110 !top-2',
      },
      message: { class: 'shadow-md overflow-hidden' },
      content: { class: 'flex items-start flex-1' },
      text: { class: 'hidden' },
      summary: { class: 'hidden' },
      detail: { class: 'hidden' },
      closeButton: {
        class: 'absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors',
      },
      closeIcon: { class: 'w-4 h-4' },
    }"
  >
    <template #message="{ message }">
      <div
        class="relative flex items-start gap-3 px-4 py-3 w-full border-l-4"
        :class="[getSeverity(message).border, getSeverity(message).bg]"
      >
        <component
          :is="getSeverity(message).icon"
          class="w-5 h-5 shrink-0 mt-0.5"
          :class="[
            getSeverity(message).iconColor,
            { 'animate-spin': getSeverity(message).loading },
          ]"
        />

        <div class="flex flex-col gap-0.5 flex-1 pr-6">
          <span class="font-medium text-sm" :class="getSeverity(message).textColor">
            {{ message.summary }}
          </span>
          <span class="text-xs text-text-muted leading-relaxed">
            {{ message.detail }}
          </span>
        </div>
      </div>
    </template>
  </Toast>

  <Toast
    group="summarizing"
    position="top-center"
    :pt="{
      root: {
        class: 'fixed top-2 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-4 w-110 !top-2',
      },
      message: { class: 'shadow-md overflow-hidden rounded-lg' },
      content: { class: 'flex items-start flex-1' },
      text: { class: 'hidden' },
      summary: { class: 'hidden' },
      detail: { class: 'hidden' },
      closeButton: { class: 'hidden' },
    }"
  >
    <template #container="{ message, closeCallback }">
      <div class="flex flex-col w-full bg-background-neutral overflow-hidden shadow-md">
        <div class="flex items-start gap-3 px-4 pt-3 pb-3">
          <IconPencilFilled class="w-5 h-5 shrink-0" />

          <div class="flex flex-col gap-0.5 flex-1">
            <span class="font-medium text-sm text-text">
              {{ message.summary }}
            </span>
            <span class="text-xs text-text-muted leading-relaxed">
              {{ message.detail }}
            </span>
          </div>

          <button
            class="text-gray-400 hover:text-gray-600 transition-colors mt-0.5"
            @click="closeCallback"
          >
            <IconX class="w-4 h-4" />
          </button>
        </div>

        <div class="px-4 py-2 bg-background-neutral flex flex-col gap-1.5">
          <ProgressBar
            :value="props.progress ?? 0"
            :show-value="false"
            class="rounded-full! h-1.5! bg-background!"
            :pt="{
              value: {
                class: '!rounded-full !bg-primary transition-all duration-300',
              },
            }"
          />

          <span class="text-xs font-medium text-primary">
            {{ Math.round(props.progress ?? 0) }}%
          </span>
        </div>

        <div class="flex items-center justify-end gap-2 px-4 py-2.5 border-t border-gray-100">
          <BaseButton variant="neutral" size="sm" label="Close" @click="closeCallback" />
          <BaseButton> View </BaseButton>
        </div>
      </div>
    </template>
  </Toast>

  <Toast
    group="network-error"
    position="top-center"
    :pt="{
      root: {
        class: 'fixed top-2 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-4 w-110 !top-2',
      },
      message: { class: 'shadow-md overflow-hidden' },
      content: { class: 'flex items-start flex-1' },
      text: { class: 'hidden' },
      summary: { class: 'hidden' },
      detail: { class: 'hidden' },
      closeButton: { class: 'hidden' },
    }"
  >
    <template #message="{ message }">
      <div
        class="relative flex items-start gap-3 px-4 py-3 w-full border-l-4 border-l-danger bg-red-50"
      >
        <IconCircleX class="w-5 h-5 shrink-0 mt-0.5 text-danger" />
        <div class="flex flex-col gap-0.5 flex-1">
          <span class="font-medium text-sm text-danger">{{ message.summary }}</span>
          <span class="text-xs text-text-muted leading-relaxed">{{ message.detail }}</span>
        </div>
      </div>
    </template>
  </Toast>
</template>
