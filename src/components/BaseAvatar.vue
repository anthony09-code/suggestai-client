<script setup lang="ts">
import Avatar from "primevue/avatar";
import { computed } from "vue";

const props = defineProps<{
  label?: string;
  image?: string;
  size?: "sm" | "md" | "lg" | "xl";
  shape?: "circle" | "square";
  bg?: string;
  textColor?: string;
}>();

const sizeClasses = computed(() => {
  switch (props.size) {
    case "sm":
      return "w-8 h-8 text-xs";
    case "lg":
      return "w-12 h-12 text-lg";
    case "xl":
      return "w-16 h-16 text-xl";
    default:
      return "w-10 h-10 text-sm";
  }
});

const shapeClasses = computed(() => (props.shape === "square" ? "rounded-xl" : "rounded-full"));
</script>

<template>
  <Avatar
    :image="image"
    :label="!image ? label : undefined"
    unstyled
    :pt="{
      root: {
        class: [
          'flex items-center justify-center overflow-hidden font-medium',
          sizeClasses,
          shapeClasses,
          bg || 'bg-primary',
          textColor || 'text-white',
        ],
      },
      image: {
        class: 'w-full h-full object-cover',
      },
      label: {
        class: 'uppercase',
      },
    }"
  />
</template>
