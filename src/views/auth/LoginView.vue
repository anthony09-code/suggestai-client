<script setup lang="ts">
import { IconBrandGoogleFilled } from "@tabler/icons-vue";
import { onMounted, onUnmounted, ref } from "vue";
import { useLogin } from "../../features/auth/composables/use.login";

const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
const turnstileRef = ref<HTMLElement | null>(null);
const turnstileToken = ref("");
const widgetId = ref("");

const email = ref("");
const password = ref("");

const { handleLogin, isPending, errorMessage, isLockedOut, lockoutSeconds } = useLogin();

onMounted(() => {
  const renderWidget = () => {
    if (window.turnstile && turnstileRef.value) {
      widgetId.value = window.turnstile.render(turnstileRef.value, {
        sitekey: turnstileSiteKey,
        theme: "light",
        size: "flexible",
        callback: (token: string) => {
          turnstileToken.value = token;
        },
        "expired-callback": () => {
          turnstileToken.value = "";
        },
      });
    }
  };

  if (window.turnstileReady) {
    renderWidget();
  } else {
    window.addEventListener("turnstile:ready", renderWidget, { once: true });
  }
});

onUnmounted(() => {
  if (widgetId.value) {
    window.turnstile?.remove(widgetId.value);
    widgetId.value = "";
  }
});

function handleSubmit() {
  if (!turnstileToken.value) {
    errorMessage.value = "Please complete the human verification.";
    return;
  }

  handleLogin(
    {
      email: email.value,
      password: password.value,
      cf_turnstile_response: turnstileToken.value,
    },
    {
      onSuccess: () => {
        window.turnstile?.reset(widgetId.value);
        turnstileToken.value = "";
      },
      onError: () => {
        window.turnstile?.reset(widgetId.value);
        turnstileToken.value = "";
      },
    },
  );
}
</script>

<template>
  <main class="min-h-screen relative">
    <!-- Logo -->
    <div class="absolute top-6 left-6">
      <h1 class="">TLC-SUGGEST</h1>
    </div>

    <!-- Login Form -->
    <div class="flex flex-col items-center justify-center min-h-screen px-6">
      <div v-if="errorMessage" class="w-full max-w-md mb-4">
        <BaseMessage severity="error" :text="errorMessage" />
      </div>

      <div class="w-full max-w-md bg-white p-14 border border-border rounded-2xl shadow">
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <h2 class="text-xl font-medium">Log in to TLC-SUGGEST</h2>

          <button
            class="w-full flex justify-center items-center border border-border py-2 px-3 gap-4 rounded-md cursor-pointer hover:bg-background-neutral transition-colors duration"
          >
            <IconBrandGoogleFilled stroke="2" size="20" />
            <span class="text-sm">Continue with Google</span>
          </button>

          <div class="flex items-center gap-4">
            <div class="flex-1 h-px bg-border"></div>
            <span class="text-sm text-text-muted">or</span>
            <div class="flex-1 h-px bg-border"></div>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-sm mb-2">Email</label>
              <BaseInput v-model="email" type="email" required />
            </div>

            <div>
              <div class="flex items-center justify-between mb-2">
                <label class="text-sm">Password</label>
                <a
                  href="#"
                  class="text-xs text-text-muted hover:text-text transition-colors duration-150"
                >
                  Forgot password?
                </a>
              </div>
              <BaseInput v-model="password" type="password" required />
            </div>

            <div>
              <p class="text-sm text-text-muted mb-2">Let us know you're human</p>
              <div class="cf-turnstile w-full" ref="turnstileRef" />
            </div>
          </div>

          <BaseButton
            type="submit"
            variant="primary"
            :label="isLockedOut ? `Try again in ${lockoutSeconds}s` : 'Log in'"
            size="small"
            class="w-full"
            :loading="isPending"
            :disabled="isPending || !turnstileToken || isLockedOut"
          />
        </form>
      </div>
    </div>
  </main>
</template>
