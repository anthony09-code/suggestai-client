<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const goToLogin = () => {
  router.push({ name: "login" });
};
</script>

<template>
  <ErrorView
    title="Unauthorized"
    message="Please login to continue."
    buttonLabel="Login"
    @action="goToLogin"
  />
</template>
