import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page, type TestInfo } from '@playwright/test';
import { seedTourSeen, waitForHydration } from './helpers';

/**
 * Automated accessibility scan (axe-core) across the 5 routes, in both the
 * light and dark theme (the site has no in-app theme toggle: dark mode is
 * driven purely by `prefers-color-scheme`, via daisyUI's `--prefersdark` on
 * the `volumendark` theme — so dark mode is exercised here by emulating the
 * OS color scheme rather than clicking a UI control).
 *
 * Severity policy: `critical`/`serious` violations fail the test outright —
 * these are the categories that reliably block a screen-reader or
 * keyboard-only user (missing labels, insufficient contrast, broken
 * landmarks, etc). `minor`/`moderate` violations are logged to the test
 * report (via `testInfo.attach`) but do not fail the run: axe's moderate/minor
 * bucket includes a fair number of best-practice or context-dependent calls
 * (e.g. "region" landmarks, redundant alt text heuristics) that are noisy
 * across a small marketing+app site and are better handled by manual review
 * than by hard-failing CI. This mirrors common pragmatic axe-in-CI setups.
 */

const ROUTES = ['/', '/app', '/about', '/legal', '/404'];

async function runAxe(page: Page, testInfo: TestInfo, route: string, theme: 'light' | 'dark') {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();

  const critical = results.violations.filter((v) => v.impact === 'critical' || v.impact === 'serious');
  const other = results.violations.filter((v) => v.impact !== 'critical' && v.impact !== 'serious');

  if (other.length > 0) {
    await testInfo.attach(`axe-minor-moderate-${route.replace(/\//g, '_') || 'home'}-${theme}`, {
      body: JSON.stringify(other, null, 2),
      contentType: 'application/json',
    });
  }

  expect(
    critical,
    `axe found ${critical.length} critical/serious violation(s) on ${route} (${theme}):\n` +
      critical.map((v) => `- [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} node(s))`).join('\n'),
  ).toEqual([]);
}

for (const route of ROUTES) {
  test(`axe scan: ${route} (light)`, async ({ page }, testInfo) => {
    await page.emulateMedia({ colorScheme: 'light' });
    // These scans exercise the steady-state app UI, not the first-visit guided
    // tour (covered separately by tests/e2e/tour.spec.ts), so seed the tour as
    // already-seen to avoid its overlay/popover appearing in the axe scan.
    if (route === '/app') await seedTourSeen(page);
    await page.goto(route);
    if (route === '/app') await waitForHydration(page);
    await runAxe(page, testInfo, route, 'light');
  });

  test(`axe scan: ${route} (dark)`, async ({ page }, testInfo) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    if (route === '/app') await seedTourSeen(page);
    await page.goto(route);
    if (route === '/app') await waitForHydration(page);
    await runAxe(page, testInfo, route, 'dark');
  });
}
