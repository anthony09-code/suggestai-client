import { createRouter, createWebHashHistory } from "vue-router";
import { useAuthStore } from "@/features/auth/stores/auth.store";

import LoginView from "../views/auth/LoginView.vue";
import PageNotFoundView from "../views/errors/PageNotFoundView.vue";
import ForbiddenView from "../views/errors/ForbiddenView.vue";
import UnauthorizedView from "../views/errors/UnauthorizedView.vue";

import CreateOfficeView from "../views/CreateOfficeView.vue";

import BaseLayout from "../layouts/BaseLayout.vue";
import SuggestionBoxLayout from "../layouts/SuggestionBoxLayout.vue";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: "/login",
      name: "login",
      component: LoginView,
      meta: {
        requiresAuth: false,
        title: "Login",
      },
    },

    {
      path: "/",
      component: BaseLayout,
      meta: {
        requiresAuth: true,
      },

      children: [
        {
          path: "dashboard",
          name: "dashboard",
          component: () => import("../views/dashboard/DashboardView.vue"),
          meta: {
            title: "Dashboard",
          },
        },

        {
          path: "offices",
          name: "offices",
          component: () => import("../views/offices/OfficeListView.vue"),
          meta: {
            title: "Offices",
          },
        },

        {
          path: "offices/:accessLink",
          component: SuggestionBoxLayout,
          redirect: (to) => `/offices/${to.params.accessLink}/overview`,
          children: [
            {
              path: "overview",
              name: "office-overview",
              component: () => import("../views/offices/OfficeOverviewView.vue"),
              meta: {
                title: "Overview",
              },
            },
            {
              path: "feedbacks",
              name: "office-feedbacks",
              component: () => import("../views/offices/OfficeFeedbackListView.vue"),
              meta: {
                title: "Feedbacks",
              },
            },
            {
              path: "summary",
              name: "office-summary",
              component: () => import("../views/offices/OfficeSuggestionSummaryView.vue"),
              meta: {
                title: "Summary",
              },
            },
            {
              path: "settings",
              name: "office-settings",
              component: () => import("../views/offices/OfficeSettingView.vue"),
              meta: {
                title: "Settings",
              },
            },
          ],
        },

        {
          path: "reports",
          name: "reports",
          component: () => import("../views/reports/ReportView.vue"),
          meta: {
            title: "Reports",
          },
        },

        {
          path: "create-office",
          name: "create-office",
          component: CreateOfficeView,
          meta: {
            title: "Create Office",
          },
        },
      ],
    },

    {
      path: "/unauthorized",
      name: "unauthorized",
      component: UnauthorizedView,
      meta: {
        title: "Unauthorized",
      },
    },

    {
      path: "/forbidden",
      name: "forbidden",
      component: ForbiddenView,
      meta: {
        title: "Forbidden",
      },
    },

    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: PageNotFoundView,
      meta: {
        title: "404 Not Found",
      },
    },
  ],
});

router.beforeEach((to) => {
  const auth = useAuthStore();
  const isAuthenticated = !!auth.token;

  const appName = import.meta.env.VITE_APP_NAME || "App";
  const pageTitle = to.meta.title as string;
  document.title = pageTitle ? `${appName} | ${pageTitle}` : appName;

  const requiresAuth = to.matched.some((r) => r.meta.requiresAuth);

  if (requiresAuth && !isAuthenticated) {
    return { name: "login" };
  }

  if (!requiresAuth && isAuthenticated && to.name === "login") {
    return { name: "dashboard" };
  }
});

export default router;
