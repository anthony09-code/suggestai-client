<script lang="ts" setup>
import { useCurrentUser } from "@/composables/use_auth.ts";

useCurrentUser();
</script>

<template>
  <BaseToast />
  <RouterView />
</template>
