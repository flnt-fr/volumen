import type { DriveStep, Driver } from 'driver.js';
// Static, not dynamic: at 4 kB this file is negligible next to the driver.js
// runtime itself, and dynamically importing it turned out to break in the
// production build — Astro/Vite emitted a <link rel="modulepreload"> for a
// CSS chunk that was never actually written to dist/_astro/, so the tour
// silently 404'd and never opened (caught by tests/e2e/tour.spec.ts failing
// against a real production preview build, not just `astro dev`).
import 'driver.js/dist/driver.css';
import type { TranslationKey } from '../i18n/strings.en';
import { markTourAsSeen } from './tourStore';

export type Translate = (key: TranslationKey, params?: Record<string, string | number>) => string;

/**
 * Steps cover only the parts of /app that are guaranteed to be on screen the
 * very first time a visitor lands there: intro, goal selector, session list
 * shell, muscle-group volume card, compliance card, and export/import bar
 * are all rendered unconditionally by ProgramBuilder.tsx.
 * Deliberately excluded: SessionEditor/ExercisePicker/MuscleVolumeTable
 * (only exist once a session has been added) and the import-error alert
 * (only exists after a failed import) — driver.js has nothing to highlight
 * for them on a first visit, so a step targeting them would either be
 * skipped (skipMissingElement) or highlight nothing useful. The header and
 * footer steps were removed on purpose (not applicable) — the tour now
 * starts on the page's main content instead of chrome around it.
 */
function buildSteps(t: Translate): DriveStep[] {
  return [
    {
      element: '[data-testid="app-intro"]',
      popover: { title: t('tour.intro.title'), description: t('tour.intro.description') },
    },
    {
      element: '[data-testid="goal-selector-card"]',
      popover: { title: t('tour.goalSelector.title'), description: t('tour.goalSelector.description') },
    },
    {
      element: '[data-testid="sessions-section"]',
      popover: { title: t('tour.sessions.title'), description: t('tour.sessions.description') },
    },
    {
      element: '[data-testid="muscle-group-volume-card"]',
      popover: { title: t('tour.muscleGroupVolume.title'), description: t('tour.muscleGroupVolume.description') },
    },
    {
      element: '[data-testid="compliance-card"]',
      popover: { title: t('tour.compliance.title'), description: t('tour.compliance.description') },
    },
    {
      element: '[data-testid="export-import-card"]',
      popover: { title: t('tour.exportImport.title'), description: t('tour.exportImport.description') },
    },
  ];
}

// Tracks the currently-open tour instance, if any, so a second call to
// startTour() (e.g. the "Show me around" button clicked while the
// auto-launched tour is still open) destroys the previous one instead of
// leaving two overlapping Driver instances/overlays stacked on top of each
// other.
let activeTour: Driver | null = null;

/**
 * Starts the guided tour of /app.
 *
 * `hasTourBeenSeen()`/`markTourAsSeen()` calls are the caller's
 * responsibility for the auto-start *decision* (see ProgramBuilder.tsx);
 * this function marks the tour as seen itself, synchronously, as soon as it
 * actually starts driving (right after `drive()`) rather than waiting for
 * it to close. This was originally wired to driver.js's `onDestroyed`
 * lifecycle hook instead, which seemed like the safer choice on paper (an
 * interrupted tour would be shown again) — but `onDestroyed` turned out to
 * only fire once driver.js's internal highlight-animation state has
 * settled, which happens asynchronously ~400ms into the highlight
 * transition; closing the popover before that (an impatient user, or a fast
 * automated test) causes `onDestroyed` to silently never fire at all,
 * leaking a tour that reopens forever. Marking on start trades "a tour
 * interrupted before the first paint might not be shown again" for
 * guaranteed correctness, which is the better default here.
 *
 * `animate: false` is deliberate, not cosmetic: driver.js's own
 * `.driver-active-element` class removal (which is what gates
 * `pointer-events` back on for the *previous* step's target — see
 * `driver-active *{pointer-events:none}` / `.driver-active-element
 * {pointer-events:auto}` in driver.css) is tied to that same ~400ms
 * highlight-transition completion callback as `onDestroyed` above. Clicking
 * "Next" faster than the animation (a realistic ~150ms pace, not just an
 * automated test) leaves the previous step's element still tagged
 * `.driver-active-element` — and therefore still clickable/interactive —
 * while the popover has already moved on to a later step, breaking the
 * tour's modal guarantee (e.g. the goal `<select>` stays editable while a
 * later step's popover is showing). Disabling the animation removes the
 * transition window entirely: the class swap happens synchronously with
 * `moveNext()`, so at most one element is ever `.driver-active-element` at
 * a time. See tests/e2e/tour.spec.ts for the regression test that drives
 * through steps at a fast, fixed cadence and asserts on this.
 *
 * Steps whose target element isn't present in the DOM are dropped from the
 * step list up front (rather than relying on driver.js's own
 * skipMissingElement) since this same tour config could in principle run
 * when localStorage already has stored sessions and the DOM briefly hasn't
 * caught up yet.
 */
export async function startTour(t: Translate): Promise<Driver | null> {
  if (typeof window === 'undefined') return null;

  // Destroy any tour still open (e.g. the auto-launched one, if "Show me
  // around" is clicked before it was dismissed) so overlays never stack.
  if (activeTour?.isActive()) {
    activeTour.destroy();
  }

  const steps = buildSteps(t).filter((step) => typeof step.element === 'string' && document.querySelector(step.element));
  if (steps.length === 0) return null;

  // driver.js's JS runtime is only needed once the tour actually starts, so
  // it's loaded lazily here instead of being bundled eagerly into the single
  // client:load island on /app — this keeps that island's initial chunk
  // under the build's chunk-size warning threshold. Its CSS is a static
  // import above (see the comment there for why).
  const { driver } = await import('driver.js');

  const driverObj = driver({
    animate: false,
    showProgress: true,
    allowClose: true,
    steps,
    nextBtnText: t('tour.next'),
    prevBtnText: t('tour.previous'),
    doneBtnText: t('tour.done'),
    progressText: t('tour.progress'),
  });

  activeTour = driverObj;
  driverObj.drive();
  markTourAsSeen();
  return driverObj;
}
