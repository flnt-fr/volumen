import { expect, test } from '@playwright/test';
import {
  addExercise,
  addSession,
  exerciseRows,
  gotoApp,
  openMuscleVolumeTable,
  muscleVolumeTable,
  renameSession,
  sessionArticles,
  setExerciseValues,
} from './helpers';

test('hypertrophy with an empty program shows "add sessions to evaluate", not "no rule defined"', async ({
  page,
}) => {
  await gotoApp(page);

  await page.getByTestId('goal-select').selectOption('hypertrophy');

  const complianceCard = page.getByTestId('compliance-card');
  const emptyMessage = complianceCard.getByTestId('compliance-empty-message');
  await expect(emptyMessage).toBeVisible();
  await expect(emptyMessage).toHaveText('Add sessions and exercises to evaluate compliance with the volume rules.');
  await expect(emptyMessage).not.toHaveText(/No volume rule defined/);
});

test('full journey: goal, sessions, exercises, muscle volume, compliance', async ({ page }) => {
  await gotoApp(page);

  // 1. Choose the "Strength" goal and check its definition + key principles.
  await page.getByTestId('goal-select').selectOption('strength');

  const goalPanel = page.locator('article').first();
  await expect(goalPanel.getByText('How much weight a person can lift')).toBeVisible();
  await expect(goalPanel.getByText('Perform key/primary lifts at the beginning of the session')).toBeVisible();
  await expect(goalPanel.getByText('Use full range of motion')).toBeVisible();
  await expect(goalPanel.getByText('Training to absolute failure is not required')).toBeVisible();

  // 2. Create two sessions.
  await addSession(page);
  await addSession(page);

  const sessions = sessionArticles(page);
  await expect(sessions).toHaveCount(2);

  const push = sessions.nth(0);
  const legs = sessions.nth(1);
  await renameSession(push, 'Push');
  await renameSession(legs, 'Legs');

  // 3. Add exercises with sets/reps/rest, within the strength goal's 2-3 sets range.
  await addExercise(push, 'Barbell Bench Press - Medium Grip');
  const pushRow = exerciseRows(push).first();
  await setExerciseValues(pushRow, { sets: '3', reps: '8-10', restSeconds: '90' });

  await addExercise(legs, 'Barbell Squat');
  const legsRow = exerciseRows(legs).first();
  await setExerciseValues(legsRow, { sets: '2', reps: '5', restSeconds: '120' });

  // 4. The sets-per-muscle table updates for each session.
  await openMuscleVolumeTable(push);
  const pushMuscleTable = muscleVolumeTable(push);
  const chestRow = pushMuscleTable.getByRole('row', { name: /chest/ });
  await expect(chestRow).toBeVisible();
  await expect(chestRow.locator('td').first()).toHaveText('3');

  await openMuscleVolumeTable(legs);
  const legsMuscleTable = muscleVolumeTable(legs);
  const quadsRow = legsMuscleTable.getByRole('row', { name: /quadriceps/ });
  await expect(quadsRow).toBeVisible();
  await expect(quadsRow.locator('td').first()).toHaveText('2');

  // 5. The compliance card reflects the strength goal's rules: 2 sessions/week
  //    minimum (met) and 2-3 sets per exercise (met for both exercises).
  const complianceCard = page.getByTestId('compliance-card');
  await expect(complianceCard.getByText(/2 session\(s\) scheduled, compliant/)).toBeVisible();
  await expect(complianceCard.getByText(/Barbell Bench Press.*compliant/)).toBeVisible();
  await expect(complianceCard.getByText(/Barbell Squat.*compliant/)).toBeVisible();
  await expect(complianceCard.locator('.rule-fail')).toHaveCount(0);

  // 6. The strength goal has no muscle-group volume rule, so the dedicated
  //    table shows the "no rule" message instead of a table.
  await expect(page.getByTestId('muscle-group-volume-empty-message')).toBeVisible();

  // 7. Each session's table lists its own exercises' direct/weighted-secondary set contribution.
  const pushContributionRow = push.getByTestId('muscle-contribution-row').first();
  await expect(pushContributionRow).toContainText('Barbell Bench Press');
  await expect(pushContributionRow).toContainText('chest');
  await expect(pushContributionRow.locator('td').nth(1)).toHaveText('3');

  const legsContributionRow = legs.getByTestId('muscle-contribution-row').first();
  await expect(legsContributionRow).toContainText('Barbell Squat');
  await expect(legsContributionRow).toContainText('quadriceps');
  await expect(legsContributionRow.locator('td').nth(1)).toHaveText('2');
});

test('muscle group volume table flags untouched muscle groups for goals with a volume rule', async ({ page }) => {
  await gotoApp(page);

  await page.getByTestId('goal-select').selectOption('hypertrophy');
  await addSession(page);
  const session = sessionArticles(page).nth(0);
  await addExercise(session, 'Barbell Bench Press - Medium Grip');
  await setExerciseValues(exerciseRows(session).first(), { sets: '12' });

  const table = page.getByTestId('muscle-group-volume-table');
  await expect(table).toBeVisible();

  const chestRow = table.getByRole('row', { name: /chest/i });
  await expect(chestRow).toHaveClass(/rule-pass/);

  const untouchedRow = table.getByTestId('muscle-group-volume-row').filter({ hasNotText: /chest/i }).first();
  await expect(untouchedRow).toHaveClass(/rule-fail/);
});

test('estimated time updates for exercise, session, and program when margin changes', async ({ page }) => {
  await gotoApp(page);

  // Two sessions, each with one exercise: 3 sets x "10" reps (avg 10) x 90s rest.
  // exerciseEstimatedSeconds = sets * (avgReps * 4 + restSeconds) + equipmentChangeSeconds
  //   = 3 * (10*4 + 90) + 60 = 450s = 7.5 min, rounds to 8 min.
  await addSession(page);
  await addSession(page);
  const sessions = sessionArticles(page);
  await expect(sessions).toHaveCount(2);

  const sessionA = sessions.nth(0);
  const sessionB = sessions.nth(1);

  await addExercise(sessionA, 'Barbell Bench Press - Medium Grip');
  await setExerciseValues(exerciseRows(sessionA).first(), { sets: '3', reps: '10', restSeconds: '90' });

  await addExercise(sessionB, 'Barbell Bench Press - Medium Grip');
  await setExerciseValues(exerciseRows(sessionB).first(), { sets: '3', reps: '10', restSeconds: '90' });

  // Per-exercise time cell reflects a plausible duration (7.5 min rounds to 8 min),
  // including the 1-minute machine change/setup breakdown.
  const timeCell = exerciseRows(sessionA).first().getByTestId('exercise-time-cell');
  await expect(timeCell).not.toBeEmpty();
  await expect(timeCell).toContainText('8 min');
  await expect(timeCell).toContainText('1 min');

  // Set a 5-minute margin per session.
  const marginInput = page.getByTestId('margin-input');
  await marginInput.fill('5');
  await marginInput.blur();

  // Each session's total = 450s (exercise) + 300s (margin) = 750s = 12.5 min, rounds to 13 min.
  await expect(sessionA.getByTestId('session-total-time')).toContainText('13 min');
  await expect(sessionB.getByTestId('session-total-time')).toContainText('13 min');

  // Program total sums both sessions' raw seconds before rounding: (450+300)*2 = 1500s = 25 min.
  await expect(page.getByTestId('program-total-time')).toContainText('25 min');
});
