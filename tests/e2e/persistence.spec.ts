import { expect, test } from '@playwright/test';
import {
  addExercise,
  addSession,
  exerciseRows,
  gotoApp,
  renameSession,
  sessionArticles,
  setExerciseValues,
  waitForHydration,
} from './helpers';

test('the program survives a page reload (localStorage persistence)', async ({ page }) => {
  await gotoApp(page);

  await page.getByTestId('goal-select').selectOption('power');
  await addSession(page);
  const session = sessionArticles(page).nth(0);
  await renameSession(session, 'Explosiveness');
  await addExercise(session, 'Barbell Squat');
  await setExerciseValues(exerciseRows(session).nth(0), { sets: '5', reps: '3', restSeconds: '150' });

  await page.reload();
  await waitForHydration(page);

  await expect(page.getByTestId('goal-select')).toHaveValue('power');
  const reloadedSessions = sessionArticles(page);
  await expect(reloadedSessions).toHaveCount(1);
  const reloadedSession = reloadedSessions.nth(0);
  await expect(reloadedSession.getByTestId('session-name-input')).toHaveValue('Explosiveness');

  const rows = exerciseRows(reloadedSession);
  await expect(rows).toHaveCount(1);
  await expect(rows.nth(0)).toContainText('Barbell Squat');
  await expect(rows.nth(0).getByTestId('exercise-sets-input')).toHaveValue('5');
  await expect(rows.nth(0).getByTestId('exercise-reps-input')).toHaveValue('3');
  await expect(rows.nth(0).getByTestId('exercise-rest-input')).toHaveValue('150');
});

test('fractional or negative numeric input is clamped and never wipes the stored program on reload', async ({
  page,
}) => {
  await gotoApp(page);

  await page.getByTestId('goal-select').selectOption('power');
  await addSession(page);
  const session = sessionArticles(page).nth(0);
  await renameSession(session, 'Explosiveness');
  await addExercise(session, 'Barbell Squat');
  const row = exerciseRows(session).nth(0);

  // Fractional/negative values must be clamped client-side before they ever
  // reach state (and therefore localStorage).
  await row.getByTestId('exercise-sets-input').fill('2.7');
  await row.getByTestId('exercise-sets-input').blur();
  await expect(row.getByTestId('exercise-sets-input')).toHaveValue('3');

  await row.getByTestId('exercise-rest-input').fill('-15');
  await row.getByTestId('exercise-rest-input').blur();
  await expect(row.getByTestId('exercise-rest-input')).toHaveValue('0');

  const marginInput = page.getByTestId('margin-input');
  await marginInput.fill('-2.4');
  await marginInput.blur();
  await expect(marginInput).toHaveValue('0');

  await page.reload();
  await waitForHydration(page);

  // The whole program must survive: no silent fallback to an empty program.
  await expect(page.getByTestId('goal-select')).toHaveValue('power');
  const reloadedSessions = sessionArticles(page);
  await expect(reloadedSessions).toHaveCount(1);
  const reloadedSession = reloadedSessions.nth(0);
  await expect(reloadedSession.getByTestId('session-name-input')).toHaveValue('Explosiveness');

  const rows = exerciseRows(reloadedSession);
  await expect(rows).toHaveCount(1);
  await expect(rows.nth(0)).toContainText('Barbell Squat');
  await expect(rows.nth(0).getByTestId('exercise-sets-input')).toHaveValue('3');
  await expect(rows.nth(0).getByTestId('exercise-rest-input')).toHaveValue('0');
  await expect(page.getByTestId('margin-input')).toHaveValue('0');
});
