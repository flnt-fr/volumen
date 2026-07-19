import { expect, test } from '@playwright/test';
import { gotoApp } from './helpers';

test('footer links navigate from the app to /about and /legal', async ({ page }) => {
  await gotoApp(page);

  const footer = page.locator('footer');
  await expect(footer).toBeVisible();
  const aboutLink = footer.getByRole('link', { name: 'About' });
  const legalLink = footer.getByRole('link', { name: 'Legal notice' });
  await expect(aboutLink).toBeVisible();
  await expect(legalLink).toBeVisible();

  await aboutLink.click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.getByRole('heading', { level: 1, name: 'About Volumen' })).toBeVisible();

  await page.goBack();
  await expect(page).toHaveURL(/\/app$/);

  await legalLink.click();
  await expect(page).toHaveURL(/\/legal$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Legal notice' })).toBeVisible();
});

test('/about links back to the app and to the source repository', async ({ page }) => {
  await page.goto('/about');

  await expect(page.getByRole('heading', { level: 1, name: 'About Volumen' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'source repository' })).toHaveAttribute(
    'href',
    'https://github.com/hex46/volumen',
  );

  await page.getByRole('link', { name: 'Open the app' }).click();
  await expect(page).toHaveURL(/\/app$/);
});

test('/legal links back to the app and lists publisher and hosting details', async ({ page }) => {
  await page.goto('/legal');

  await expect(page.getByRole('heading', { level: 1, name: 'Legal notice' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'volumen@hex46.fr' })).toHaveAttribute(
    'href',
    'mailto:volumen@hex46.fr',
  );
  await expect(page.getByText('OVH SAS', { exact: false })).toBeVisible();

  await page.getByRole('link', { name: 'Open the app' }).click();
  await expect(page).toHaveURL(/\/app$/);
});

test('an unknown URL shows the custom 404 page and links back to the app', async ({ page }) => {
  const response = await page.goto('/this-route-does-not-exist');

  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1, name: '404 — Page not found' })).toBeVisible();

  await page.getByRole('link', { name: 'Go to the home page' }).click();
  await expect(page).toHaveURL(/\/$/);
});
