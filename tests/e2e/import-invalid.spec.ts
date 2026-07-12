import { expect, test } from '@playwright/test';
import { addSession, gotoApp, renameSession, sessionArticles } from './helpers';

async function importBuffer(page: import('@playwright/test').Page, payload: unknown) {
  await page.getByTestId('import-input').setInputFiles({
    name: 'invalid.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(payload)),
  });
}

test('importing a file with a broken schema shows an error and does not change the state', async ({ page }) => {
  await gotoApp(page);
  await page.getByTestId('goal-select').selectOption('strength');
  await addSession(page);
  const session = sessionArticles(page).nth(0);
  await renameSession(session, 'Do not touch');

  await importBuffer(page, { totally: 'not a program file' });

  const alert = page.getByTestId('import-error');
  await expect(alert).toBeVisible();
  await expect(alert).toContainText('The imported file is invalid');

  // State is untouched.
  await expect(page.getByTestId('goal-select')).toHaveValue('strength');
  await expect(sessionArticles(page)).toHaveCount(1);
  await expect(session.getByTestId('session-name-input')).toHaveValue('Do not touch');
});

test('importing a file with an unknown goalId/exerciseId shows an error and does not change the state', async ({
  page,
}) => {
  await gotoApp(page);
  await page.getByTestId('goal-select').selectOption('strength');
  await addSession(page);
  const session = sessionArticles(page).nth(0);
  await renameSession(session, 'Do not touch either');

  await importBuffer(page, {
    header: {
      goal: {
        id: 'not-a-real-goal',
        name: 'Fake goal',
        definition: 'Fake definition',
        keyPrinciples: ['Fake principle'],
      },
      compliance: [],
    },
    sessions: [
      {
        id: 'session-1',
        name: 'Ghost session',
        exercises: [
          {
            id: 'exercise-1',
            exerciseId: 'not-a-real-exercise-id',
            name: 'Fake exercise',
            sets: 3,
            reps: '10',
            restSeconds: 60,
          },
        ],
      },
    ],
  });

  const alert = page.getByTestId('import-error');
  await expect(alert).toBeVisible();
  await expect(alert).toContainText('unknown goal "not-a-real-goal"');
  await expect(alert).toContainText('unknown exercise "not-a-real-exercise-id"');

  // State is untouched.
  await expect(page.getByTestId('goal-select')).toHaveValue('strength');
  await expect(sessionArticles(page)).toHaveCount(1);
  await expect(session.getByTestId('session-name-input')).toHaveValue('Do not touch either');
});

test('importing a file that is not valid JSON shows an error and does not change the state', async ({ page }) => {
  await gotoApp(page);
  await addSession(page);
  const session = sessionArticles(page).nth(0);
  await renameSession(session, 'Still here');

  await page.getByTestId('import-input').setInputFiles({
    name: 'not-json.json',
    mimeType: 'application/json',
    buffer: Buffer.from('{ this is not json'),
  });

  const alert = page.getByTestId('import-error');
  await expect(alert).toBeVisible();
  await expect(alert).toContainText('is not valid JSON');

  await expect(sessionArticles(page)).toHaveCount(1);
  await expect(session.getByTestId('session-name-input')).toHaveValue('Still here');
});
