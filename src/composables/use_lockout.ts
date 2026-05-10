import { ref, onUnmounted } from "vue";

export function useLockout() {
  const isLockedOut = ref(false);
  const lockoutSeconds = ref(0);
  let timer: ReturnType<typeof setInterval> | null = null;

  function start(seconds: number) {
    if (timer) clearInterval(timer);
    isLockedOut.value = true;
    lockoutSeconds.value = seconds;

    timer = setInterval(() => {
      lockoutSeconds.value--;
      if (lockoutSeconds.value <= 0) {
        isLockedOut.value = false;
        lockoutSeconds.value = 0;
        if (timer) clearInterval(timer);
      }
    }, 1000);
  }

  onUnmounted(() => {
    if (timer) clearInterval(timer);
  });

  return { isLockedOut, lockoutSeconds, start };
}
