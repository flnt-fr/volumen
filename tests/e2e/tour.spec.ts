import { expect, test } from '@playwright/test';
import { waitForHydration } from './helpers';

const TOUR_STORAGE_KEY = 'volumen:tourSeen';

test('a first-time visitor sees the guided tour auto-launch on /app', async ({ page }) => {
  await page.goto('/app');
  await waitForHydration(page);

  await expect(page.locator('.driver-popover')).toBeVisible();
  await expect(page.locator('.driver-popover-title')).toHaveText('Your program');

  // Highlighted element for the first step is the intro.
  await expect(page.locator('.driver-active-element')).toHaveAttribute('data-testid', 'app-intro');
});

test('the tour marks itself as seen as soon as it starts, and closing it leaves that in place for a fresh reload', async ({ page }) => {
  await page.goto('/app');
  await waitForHydration(page);

  await expect(page.locator('.driver-popover')).toBeVisible();
  // Marked as seen synchronously once the tour starts driving (see
  // src/lib/tour.ts for why this doesn't wait for the close event).
  expect(await page.evaluate((key) => window.localStorage.getItem(key), TOUR_STORAGE_KEY)).toBe('true');

  await page.locator('.driver-popover-close-btn').click();
  await expect(page.locator('.driver-popover')).toBeHidden();
  expect(await page.evaluate((key) => window.localStorage.getItem(key), TOUR_STORAGE_KEY)).toBe('true');

  await page.reload();
  await waitForHydration(page);
  await expect(page.locator('.driver-popover')).toBeHidden();
});

test('stepping through every "Next" button advances the popover through each step in order and ends on "Done"', async ({ page }) => {
  await page.goto('/app');
  await waitForHydration(page);

  await expect(page.locator('.driver-popover')).toBeVisible();

  const expectedTitles = [
    'Your program',
    'Training goal',
    'Sessions',
    'Muscle group volume',
    'Volume rule compliance',
    'Export / import',
  ];

  // Click "Next" repeatedly, asserting the popover title advances through
  // every expected step (not just that the tour ends up closed) and that
  // the last step's button reads "Done" rather than "Next".
  for (let i = 0; i < expectedTitles.length; i++) {
    await expect(page.locator('.driver-popover-title')).toHaveText(expectedTitles[i]);
    const nextBtn = page.locator('.driver-popover-next-btn');
    await expect(nextBtn).toHaveText(i === expectedTitles.length - 1 ? 'Done' : 'Next');
    await nextBtn.click();
  }

  await expect(page.locator('.driver-popover')).toBeHidden();
  expect(await page.evaluate((key) => window.localStorage.getItem(key), TOUR_STORAGE_KEY)).toBe('true');
});

// Regression test for a blocking bug found in live browser review: driver.js
// ties the removal of the *previous* step's `.driver-active-element` class
// (which is what gates pointer-events back on for that element — see
// driver.css) to its highlight-transition animation completing, ~400ms
// after moveNext(). Clicking "Next" at a realistic fast pace (~150ms, well
// under that) used to leave the previous step's element still tagged
// `.driver-active-element` — and therefore still interactive — while the
// popover had already moved on to a later step, letting the visitor edit
// the app (e.g. the goal <select>) mid-tour. Fixed via `animate: false` in
// src/lib/tour.ts, which removes the async transition window entirely.
test('clicking "Next" rapidly never leaves more than one element interactive at a time', async ({ page }) => {
  await page.goto('/app');
  await waitForHydration(page);

  await expect(page.locator('.driver-popover')).toBeVisible();

  for (let i = 0; i < 4; i++) {
    await page.locator('.driver-popover-next-btn').click();
    // No wait beyond Playwright's own action delay — simulates a visitor
    // clicking through at a brisk, but human, pace (~150ms apart).
    await page.waitForTimeout(150);
    const activeCount = await page.locator('.driver-active-element').count();
    expect(activeCount).toBeLessThanOrEqual(1);
  }

  // The goal <select> must not be interactive while the popover has moved
  // past the "Training goal" step (it was the 2nd step; by now the tour is
  // well past it).
  await expect(page.getByTestId('goal-select')).not.toHaveClass(/driver-active-element/);
});

test('the manual "Show me around" button relaunches the tour at any time', async ({ page }) => {
  await page.goto('/app');
  await waitForHydration(page);

  // Dismiss the auto-launched tour first.
  await page.locator('.driver-popover-close-btn').click();
  await expect(page.locator('.driver-popover')).toBeHidden();

  await page.getByTestId('start-tour-button').click();
  await expect(page.locator('.driver-popover')).toBeVisible();
  await expect(page.locator('.driver-popover-title')).toHaveText('Your program');
});

test('the manual "Show me around" button replaces an already-open auto-launched tour instead of stacking a second one', async ({ page }) => {
  await page.goto('/app');
  await waitForHydration(page);

  await expect(page.locator('.driver-popover')).toBeVisible();

  // Click the manual button while the auto-launched tour is still open. Now
  // that the header is no longer a tour step, the header (and the button
  // inside it) sits under driver.js's overlay — which sets `pointer-events:
  // none` on everything except the currently highlighted element and the
  // popover itself (see driver.css `.driver-active *{pointer-events:none}`)
  // — so a real pointer click can no longer land on the button at all: at
  // that screen position the overlay itself receives the click and (since
  // `allowClose: true`) treats it as "dismiss", which isn't what this test
  // wants to exercise. `dispatchEvent('click')` fires the click event
  // directly on the button (bypassing hit-testing/coordinates entirely) so
  // this still exercises the destroy-previous-instance guard in startTour()
  // (src/lib/tour.ts), which remains real defensive logic even though this
  // exact interaction isn't reachable with an actual pointer anymore.
  await page.getByTestId('start-tour-button').dispatchEvent('click');

  // Exactly one popover and one highlighted element, not two stacked instances.
  await expect(page.locator('.driver-popover')).toHaveCount(1);
  expect(await page.locator('.driver-active-element').count()).toBeLessThanOrEqual(1);
  await expect(page.locator('.driver-popover-title')).toHaveText('Your program');
});

test('the tour does not auto-launch for a returning visitor', async ({ page }) => {
  await page.addInitScript(
    (key) => window.localStorage.setItem(key, 'true'),
    TOUR_STORAGE_KEY,
  );
  await page.goto('/app');
  await waitForHydration(page);

  await expect(page.locator('.driver-popover')).toBeHidden();
  await expect(page.getByTestId('sessions-section')).toBeVisible();
});
