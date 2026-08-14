import type { Router } from 'expo-router';

/** Pop the stack when possible; otherwise replace with a stable fallback route. */
export function navigateBackOrReplace(router: Router, fallbackRoute: '/log' | '/(tabs)/log'): void {
  if (router.canGoBack()) {
    router.back();
    return;
  }

  router.replace(fallbackRoute);
}
