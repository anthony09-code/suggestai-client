import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

export function useBaseRouter() {
  const router = useRouter();
  const route = useRoute();

  const params = computed(() => route.params);
  const query = computed(() => route.query);
  const path = computed(() => route.path);

  function push(to: string) {
    return router.push(to);
  }

  function replace(to: string) {
    return router.replace(to);
  }

  function back() {
    return router.back();
  }

  function isActive(basePath: string) {
    return computed(() => route.path.startsWith(basePath));
  }

  return { route, router, params, query, path, push, replace, back, isActive };
}
