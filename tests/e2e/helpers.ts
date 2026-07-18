import type { Locator, Page } from '@playwright/test';

/**
 * The Preact island hydrates asynchronously (`client:load`). The first effect
 * in ProgramBuilder reads localStorage and immediately writes it back, so the
 * presence of the storage key is a reliable signal that hydration finished
 * and the app is ready to receive interactions.
 */
export async function waitForHydration(page: Page) {
  await page.waitForFunction(() => window.localStorage.getItem('volumen:program') !== null);
}

/**
 * Marks the guided tour (driver.js, see src/lib/tour.ts) as already seen
 * before the page even loads, via an init script that runs before any of
 * the page's own scripts. Every test in this suite except
 * tests/e2e/tour.spec.ts uses this (through gotoApp/seedTourSeen) so the
 * tour's auto-launch-on-first-visit behavior — and its full-page overlay,
 * which would otherwise intercept clicks meant for the app underneath —
 * doesn't interfere with unrelated flows. Each Playwright test gets a fresh
 * browser context (no localStorage carried over), so without this every
 * test would otherwise see a fresh "first visit".
 */
export async function seedTourSeen(page: Page) {
  await page.addInitScript(() => window.localStorage.setItem('volumen:tourSeen', 'true'));
}

export async function gotoApp(page: Page) {
  await seedTourSeen(page);
  await page.goto('/app');
  await waitForHydration(page);
}

export async function clearProgram(page: Page) {
  await page.evaluate(() => window.localStorage.removeItem('volumen:program'));
  await page.reload();
  await waitForHydration(page);
}

export function sessionsSection(page: Page): Locator {
  return page.getByTestId('sessions-section');
}

export function sessionArticles(page: Page): Locator {
  return sessionsSection(page).getByTestId('session');
}

export async function addSession(page: Page) {
  await sessionsSection(page).getByTestId('add-session-button').click();
}

export async function renameSession(session: Locator, name: string) {
  const input = session.getByTestId('session-name-input');
  await input.fill(name);
  await input.blur();
}

export async function addExercise(session: Locator, exerciseName: string) {
  const picker = session.getByTestId('exercise-picker-input');
  await picker.fill(exerciseName);
  await session.getByTestId('exercise-picker-add-button').click();
}

export function exerciseRows(session: Locator): Locator {
  return session.getByTestId('exercise-row');
}

export async function setExerciseValues(
  row: Locator,
  values: { sets?: string; reps?: string; restSeconds?: string },
) {
  if (values.sets !== undefined) {
    await row.getByTestId('exercise-sets-input').fill(values.sets);
  }
  if (values.reps !== undefined) {
    await row.getByTestId('exercise-reps-input').fill(values.reps);
  }
  if (values.restSeconds !== undefined) {
    await row.getByTestId('exercise-rest-input').fill(values.restSeconds);
  }
}

export function muscleVolumeTable(session: Locator): Locator {
  return session.getByTestId('muscle-volume-table');
}

export async function openMuscleVolumeTable(session: Locator) {
  await session.getByTestId('muscle-volume-summary').click();
}

export async function openMuscleContributionTable(session: Locator) {
  await session.getByTestId('muscle-contribution-summary').click();
}

export async function openMuscleGroupVolumeTable(page: Page) {
  await page.getByTestId('muscle-group-volume-table-summary').click();
}
