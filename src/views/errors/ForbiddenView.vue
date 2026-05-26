<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const goBack = () => {
  router.back();
};
</script>

<template>
  <ErrorView
    title="Access Denied"
    message="You do not have permission to access this page."
    buttonLabel="Go Back"
    @click="goBack"
  />
</template>
