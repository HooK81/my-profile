import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    exclude: ['dist/**', 'node_modules/**'],
    coverage: {
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/test-setup.ts',
        'src/main.tsx',
        'src/**/*.d.ts',
        'src/utils/console-greeting.ts',
      ],
    },
    css: {
      modules: {
        classNameStrategy: 'non-scoped',
      },
    },
  },
});
