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
  horizontal?: boolean;
  stacked?: boolean;
  height?: string;
}>();

const defaultColors = ["#14b8a6", "#f59e0b", "#ef4444", "#0d9488", "#dc2626", "#6b7280"];

const chartData = computed(() => ({
  labels: props.labels,
  datasets: props.datasets.map((ds, i) => ({
    label: ds.label,
    data: ds.data,
    backgroundColor: (ds.color ?? defaultColors[i % defaultColors.length]) + "33",
    borderColor: ds.color ?? defaultColors[i % defaultColors.length],
    borderWidth: 2,
    borderRadius: 6,
  })),
}));

const chartOptions = computed(() => ({
  indexAxis: props.horizontal ? "y" : "x",
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: props.datasets.length > 1,
      labels: {
        color: "#000000",
        font: { size: 12, family: "Poppins" },
        boxWidth: 12,
        boxHeight: 12,
        borderRadius: 4,
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
  scales: {
    x: {
      stacked: props.stacked,
      grid: { color: "#e5e7eb" },
      ticks: {
        color: "rgb(89, 89, 89)",
        font: { size: 11, family: "Poppins" },
      },
      border: { display: false },
    },
    y: {
      stacked: props.stacked,
      grid: { color: "#e5e7eb" },
      ticks: {
        color: "rgb(89, 89, 89)",
        font: { size: 11, family: "Poppins" },
      },
      border: { display: false },
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
      <Chart type="bar" :data="chartData" :options="chartOptions" class="h-full w-full" />
    </div>
  </div>
</template>
