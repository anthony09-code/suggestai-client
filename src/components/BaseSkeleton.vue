<script lang="ts" setup>
import Skeleton from "primevue/skeleton";

defineProps({
  width: { type: String, default: "100%" },
  height: { type: String, default: "1rem" },
  shape: { type: String, default: "rectangle" },
});
</script>

<template>
  <Skeleton
    :width="width"
    :height="height"
    :shape="shape"
    :pt="{
      root: { class: 'sk' },
    }"
  />
</template>
