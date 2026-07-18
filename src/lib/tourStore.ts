export const TOUR_STORAGE_KEY = 'volumen:tourSeen';

/**
 * Tracks whether the /app guided tour (driver.js) has already been shown to
 * this visitor, mirroring src/i18n/localeStore.ts's SSR-guarded localStorage
 * wrapper pattern: a dedicated get/set pair behind a namespaced key, both
 * no-ops server-side since /app is a client:load-only island.
 */

/** Returns true once the visitor has already gone through (or dismissed) the tour. Always false server-side. */
export function hasTourBeenSeen(): boolean {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(TOUR_STORAGE_KEY) === 'true';
}

/** Persists that the tour has been shown, so it won't auto-start again. No-op server-side. */
export function markTourAsSeen(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(TOUR_STORAGE_KEY, 'true');
}
