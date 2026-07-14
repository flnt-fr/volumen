import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/lib/**/*.test.ts', 'src/i18n/**/*.test.ts', 'src/i18n/**/*.test.tsx'],
    exclude: ['tests/e2e/**'],
  },
});
