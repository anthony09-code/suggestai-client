import { defineStore } from "pinia";
import { ref } from "vue";
import type { SessionDetail } from "../types/analysis.types";

export const useAnalysisStore = defineStore(
  "analysis",
  () => {
    const completedSession = ref<SessionDetail | null>(null);

    function setCompletedSession(session: SessionDetail) {
      completedSession.value = session;
    }

    function clearCompletedSession() {
      completedSession.value = null;
    }

    return {
      completedSession,
      setCompletedSession,
      clearCompletedSession,
    };
  },
  {
    persist: true,
  },
);
