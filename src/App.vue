<script lang="ts" setup>
import { useCurrentUser } from "@/features/auth/composables/use.current.user";

useCurrentUser();
</script>

<template>
  <BaseToast />
  <RouterView />
</template>
