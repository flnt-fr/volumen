import { expect, test } from '@playwright/test';
import { seedTourSeen, waitForHydration } from './helpers';

test('the homepage shows the marketing hero and links to /about', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { level: 1, name: /build a program your volume actually supports/i }),
  ).toBeVisible();

  await page.getByRole('link', { name: 'Learn more' }).click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.getByRole('heading', { level: 1, name: 'About Volumen' })).toBeVisible();
});

test('the primary CTA navigates to /app and loads the working program builder', async ({ page }) => {
  // Not exercising the tour here (see tests/e2e/tour.spec.ts); avoid its
  // auto-launch overlay so this stays a focused navigation/hydration check.
  await seedTourSeen(page);
  await page.goto('/');

  await page.getByRole('link', { name: 'Create my program' }).first().click();
  await expect(page).toHaveURL(/\/app$/);

  await waitForHydration(page);
  await expect(page.getByTestId('sessions-section')).toBeVisible();
});

test('the homepage hero does not overflow on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');

  await expect(
    page.getByRole('heading', { level: 1, name: /build a program your volume actually supports/i }),
  ).toBeVisible();

  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
});
