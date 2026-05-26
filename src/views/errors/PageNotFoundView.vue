<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const goBack = () => {
  router.back();
};
</script>

<template>
  <ErrorView
    title="Page Not Found"
    message="The page you are looking for does not exist."
    buttonLabel="Go Back"
    @click="goBack"
  />
</template>
