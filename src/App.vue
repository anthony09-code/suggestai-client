<script lang="ts" setup>
import { useCurrentUser } from "@/features/auth/composables/use.current.user";
import { initToast } from "@/lib/toast";
import { initNetworkListeners } from "@/lib/network";

initToast();
initNetworkListeners();
useCurrentUser();
</script>

<template>
  <BaseToast />
  <RouterView />
</template>
