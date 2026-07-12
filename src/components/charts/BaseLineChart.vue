<script setup lang="ts">
import { computed } from "vue";
import type { LinearScaleOptions } from "chart.js";

type Dataset = {
  label: string;
  data: number[];
  borderColor?: string;
  backgroundColor?: string;
  yAxisID: string;
  tension?: number;
};

type Axis = {
  id: string;
  position: "left" | "right";
  label?: string;
  grid?: boolean;
};

const props = defineProps<{
  labels: string[];
  datasets: Dataset[];
  axes?: Axis[];
  height?: string;
  title?: string;
  subtitle?: string;
}>();

const chartData = computed(() => ({
  labels: props.labels,
  datasets: props.datasets,
}));

const chartOptions = computed(() => {
  const axesConfig: Record<string, LinearScaleOptions> = {};

  (props.axes ?? []).forEach((axis) => {
    axesConfig[axis.id] = {
      display: true,
      position: axis.position,
      grid: {
        drawOnChartArea: axis.grid ?? axis.position === "left",
      },
      title: axis.label ? { title: { display: true, text: axis.label } } : {},
    } as LinearScaleOptions;
  });

  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: {
        grid: { display: false },
      },
      ...axesConfig,
    },
  };
});
</script>

<template>
  <div class="w-full">
    <div v-if="title || subtitle" class="mb-4">
      <p v-if="title" class="text-sm font-medium text-text">{{ title }}</p>
      <p v-if="subtitle" class="text-xs text-text-muted">{{ subtitle }}</p>
    </div>
    <div :style="{ height: height ?? '300px' }">
      <Chart type="line" :data="chartData" :options="chartOptions" class="h-full w-full" />
    </div>
  </div>
</template>
