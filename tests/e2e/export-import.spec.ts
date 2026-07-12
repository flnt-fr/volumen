import fs from 'node:fs';
import { expect, test } from '@playwright/test';
import {
  addExercise,
  addSession,
  clearProgram,
  exerciseRows,
  gotoApp,
  renameSession,
  sessionArticles,
  setExerciseValues,
} from './helpers';

test('export then re-import the same JSON file rebuilds an identical program', async ({ page }) => {
  await gotoApp(page);

  // Pick a non-default goal so the round-trip is meaningful.
  await page.getByTestId('goal-select').selectOption('hypertrophy');

  await addSession(page);
  const session = sessionArticles(page).nth(0);
  await renameSession(session, 'Full Body');

  await addExercise(session, 'Barbell Squat');
  await setExerciseValues(exerciseRows(session).nth(0), { sets: '4', reps: '10', restSeconds: '75' });

  await addExercise(session, 'Bent Over Barbell Row');
  await setExerciseValues(exerciseRows(session).nth(1), { sets: '3', reps: '12', restSeconds: '60' });

  // Export the program.
  const downloadPromise = page.waitForEvent('download');
  await page.getByTestId('export-button').click();
  const download = await downloadPromise;
  const downloadPath = await download.path();
  if (!downloadPath) throw new Error('Download did not produce a file path.');
  const exportedBuffer = fs.readFileSync(downloadPath);

  // Reset to an empty state.
  await clearProgram(page);
  await expect(page.getByTestId('goal-select')).toHaveValue('strength');
  await expect(page.getByTestId('no-sessions-message')).toBeVisible();

  // Re-import the exported file.
  await page.getByTestId('import-input').setInputFiles({
    name: 'program.json',
    mimeType: 'application/json',
    buffer: exportedBuffer,
  });

  // The rebuilt state matches what was exported.
  await expect(page.getByTestId('goal-select')).toHaveValue('hypertrophy');

  const rebuiltSessions = sessionArticles(page);
  await expect(rebuiltSessions).toHaveCount(1);
  const rebuiltSession = rebuiltSessions.nth(0);
  await expect(rebuiltSession.getByTestId('session-name-input')).toHaveValue('Full Body');

  const rows = exerciseRows(rebuiltSession);
  await expect(rows).toHaveCount(2);
  await expect(rows.nth(0)).toContainText('Barbell Squat');
  await expect(rows.nth(0).getByTestId('exercise-sets-input')).toHaveValue('4');
  await expect(rows.nth(0).getByTestId('exercise-reps-input')).toHaveValue('10');
  await expect(rows.nth(0).getByTestId('exercise-rest-input')).toHaveValue('75');

  await expect(rows.nth(1)).toContainText('Bent Over Barbell Row');
  await expect(rows.nth(1).getByTestId('exercise-sets-input')).toHaveValue('3');
  await expect(rows.nth(1).getByTestId('exercise-reps-input')).toHaveValue('12');
  await expect(rows.nth(1).getByTestId('exercise-rest-input')).toHaveValue('60');
});
