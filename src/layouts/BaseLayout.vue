<script setup lang="ts">
import {
  IconDashboardFilled,
  IconLayoutDashboardFilled,
  IconReportAnalyticsFilled,
  IconBox,
} from "@tabler/icons-vue";
import { useRoute } from "vue-router";
import { ref, computed } from "vue";
import { useUserInitials } from "@/composables/use.user.initials";
import { useLogout } from "@/features/auth/composables/use.logout";
import { useOffices } from "@/features/office/composables/use.office";
import type { MenuItem } from "@/components/BaseMenu";

const route = useRoute();
const { initials } = useUserInitials();
const { logoutMutate } = useLogout();
const { data: offices } = useOffices();

const isOfficeLayout = computed(() => route.path.startsWith("/offices/"));

const loadingOffices = computed(() => !offices.value);

const avatarMenu = ref<InstanceType<typeof BaseMenu> | null>(null);

const menuItems = computed<MenuItem[]>(() => [
  { label: "Profile", command: () => router.push("/profile") },
  { separator: true },
  { label: "Logout", command: () => logoutMutate() },
]);
</script>

<template>
  <div class="flex min-h-screen">
    <aside class="fixed left-0 top-0 h-screen w-20 flex flex-col items-center py-4">
      <div class="flex items-center justify-center font-bold text-xl mb-8">L</div>

      <nav class="flex flex-col items-center gap-1">
        <router-link
          v-tooltip="{ value: 'Dashboard', showDelay: 100 }"
          to="/dashboard"
          class="p-2 rounded-lg flex items-center justify-center text-text-muted hover:bg-text-muted/10 transition duration-150"
          active-class="bg-text-muted/10"
        >
          <IconDashboardFilled :size="22" />
        </router-link>

        <router-link
          v-tooltip.right="'Offices'"
          to="/offices"
          class="p-2 rounded-lg flex items-center justify-center text-text-muted hover:bg-text-muted/10 transition duration-150"
          active-class="bg-text-muted/10"
        >
          <IconLayoutDashboardFilled :size="22" />
        </router-link>

        <div class="flex flex-col items-center gap-2 py-2">
          <div v-if="loadingOffices" v-for="n in 4" :key="'sk-office-' + n" class="p-2">
            <BaseSkeleton width="22px" height="22px" shape="circle" />
          </div>

          <router-link
            v-else
            v-for="office in offices"
            :key="office.id"
            v-tooltip.right="office.office_name"
            :to="`/offices/${office.id}`"
            class="p-2 rounded-lg flex items-center justify-center text-primary hover:bg-primary/10 transition duration-150"
            active-class="bg-primary/10 text-primary"
          >
            <IconBox :size="22" />
          </router-link>
        </div>

        <router-link
          v-tooltip.right="'Reports'"
          to="/reports"
          class="p-2 rounded-lg flex items-center justify-center text-text-muted hover:bg-text-muted/10 transition duration-150"
          active-class="bg-text-muted/10"
        >
          <IconReportAnalyticsFilled :size="22" />
        </router-link>
      </nav>

      <div class="mt-auto">
        <BaseMenu ref="avatarMenu" :items="menuItems" />
        <BaseAvatar
          :label="initials"
          size="md"
          bg="bg-primary"
          class="cursor-pointer"
          @click="(e) => avatarMenu?.toggle(e)"
        />
      </div>
    </aside>

    <main class="flex-1 ml-20 py-4 pr-4 h-screen overflow-hidden">
      <div
        v-if="!isOfficeLayout"
        class="bg-background border border-border rounded-2xl p-12 h-[calc(100vh-2rem)] overflow-y-auto"
      >
        <RouterView />
      </div>
      <div v-else class="h-[calc(100vh-2rem)] overflow-hidden">
        <RouterView />
      </div>
    </main>
  </div>
</template>
