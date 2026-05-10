import { createRouter, createWebHashHistory } from "vue-router";

import LoginView from "../views/auth/LoginView.vue";
import PageNotFoundView from "../views/errors/PageNotFoundView.vue";
import ForbiddenView from "../views/errors/ForbiddenView.vue";

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
        },

        {
          path: "offices",
          name: "offices",
          component: () => import("../views/offices/OfficeListView.vue"),
        },

        {
          path: "offices/:slug",
          component: SuggestionBoxLayout,

          children: [
            {
              path: "",
              name: "office-overview",
              component: () => import("../views/offices/OfficeOverviewView.vue"),
            },

            {
              path: "suggestions",
              name: "office-suggestions",
              component: () => import("../views/offices/OfficeSuggestionListView.vue"),
            },

            {
              path: "summary",
              name: "office-summary",
              component: () => import("../views/offices/OfficeSuggestionSummaryView.vue"),
            },

            {
              path: "settings",
              name: "office-settings",
              component: () => import("../views/offices/OfficeSettingView.vue"),
            },
          ],
        },

        {
          path: "reports",
          name: "reports",
          component: () => import("../views/reports/ReportView.vue"),
        },
      ],
    },

    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: PageNotFoundView,
      meta: {
        title: "404 Not Found",
      },
    },

    {
      path: "/forbidden",
      name: "forbidden",
      component: ForbiddenView,

      meta: {
        title: "403 Forbidden",
      },
    },
  ],
});

router.beforeEach((to, _from) => {
  const isAuthenticated = !!localStorage.getItem("token");

  const appName = "TLC-SUGGEST";

  const pageTitle = to.meta.title as string;

  document.title = pageTitle ? `${pageTitle} | ${appName}` : appName;

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requiresAuth && !isAuthenticated) {
    return { name: "login" };
  } else if (!requiresAuth && isAuthenticated && to.name === "login") {
    return { name: "dashboard" };
  }
});

export default router;
