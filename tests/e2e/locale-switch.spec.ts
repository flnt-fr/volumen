import fs from 'node:fs';
import { expect, test } from '@playwright/test';
import { addSession, gotoApp, sessionArticles, waitForHydration } from './helpers';

test('switching language translates the UI and persists across reload', async ({ page }) => {
  await gotoApp(page);

  await expect(page.getByRole('heading', { name: 'Training goal' })).toBeVisible();
  await expect(page.getByTestId('locale-select')).toHaveValue('en');
  expect(await page.evaluate(() => document.documentElement.lang)).toBe('en');

  await page.getByTestId('locale-select').selectOption('fr');

  await expect(page.getByRole('heading', { name: "Objectif d'entraînement" })).toBeVisible();
  await expect(page.getByTestId('sessions-section').getByRole('heading', { name: 'Séances' })).toBeVisible();
  await expect(page.getByTestId('no-sessions-message')).toHaveText('Aucune séance pour le moment.');
  expect(await page.evaluate(() => document.documentElement.lang)).toBe('fr');
  expect(await page.evaluate(() => window.localStorage.getItem('volumen:locale'))).toBe('fr');

  await page.reload();
  await waitForHydration(page);

  await expect(page.getByTestId('locale-select')).toHaveValue('fr');
  await expect(page.getByRole('heading', { name: "Objectif d'entraînement" })).toBeVisible();
});

test('exported program reflects the active locale', async ({ page }) => {
  await gotoApp(page);

  await page.getByTestId('locale-select').selectOption('fr');
  await addSession(page);
  const session = sessionArticles(page).nth(0);
  await expect(session.getByTestId('session-name-input')).toHaveValue('Séance 1');

  const downloadPromise = page.waitForEvent('download');
  await page.getByTestId('export-button').click();
  const download = await downloadPromise;
  const downloadPath = await download.path();
  if (!downloadPath) throw new Error('Download did not produce a file path.');
  const exported = JSON.parse(fs.readFileSync(downloadPath, 'utf-8'));

  expect(exported.header.goal.name).toBe('Force');
  expect(exported.header.compliance[0].message).toContain('séance(s)');
});
