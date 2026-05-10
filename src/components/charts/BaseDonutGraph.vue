<script setup lang="ts">
import { computed } from "vue";

type Dataset = {
  label: string;
  data: number[];
  color?: string;
};

const props = defineProps<{
  labels: string[];
  datasets: Dataset[];
  title?: string;
  subtitle?: string;
  height?: string;
  cutout?: string;
}>();

const defaultColors = ["#14b8a6", "#f59e0b", "#ef4444", "#0d9488", "#dc2626", "#6b7280"];

const chartData = computed(() => ({
  labels: props.labels,
  datasets: props.datasets.map((ds) => ({
    label: ds.label,
    data: ds.data,
    backgroundColor: props.labels.map((_, i) => defaultColors[i % defaultColors.length]),
    borderColor: "#ffffff",
    borderWidth: 2,
    hoverOffset: 6,
  })),
}));

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  cutout: props.cutout ?? "70%",
  plugins: {
    legend: {
      position: "bottom" as const,
      labels: {
        color: "#000000",
        font: { size: 12, family: "Poppins" },
        boxWidth: 12,
        boxHeight: 12,
        borderRadius: 4,
        padding: 16,
      },
    },
    title: { display: false },
    tooltip: {
      backgroundColor: "#ffffff",
      titleColor: "#000000",
      bodyColor: "rgb(89, 89, 89)",
      borderColor: "#e5e7eb",
      borderWidth: 1,
      padding: 10,
      cornerRadius: 8,
      titleFont: { family: "Poppins" },
      bodyFont: { family: "Poppins" },
    },
  },
}));
</script>

<template>
  <div class="w-full">
    <div v-if="title || subtitle" class="mb-4">
      <p v-if="title" class="text-sm font-medium text-text">{{ title }}</p>
      <p v-if="subtitle" class="text-xs text-text-muted">{{ subtitle }}</p>
    </div>
    <div :style="{ height: height ?? '300px' }">
      <Chart type="doughnut" :data="chartData" :options="chartOptions" class="h-full w-full" />
    </div>
  </div>
</template>
