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

export async function gotoApp(page: Page) {
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
