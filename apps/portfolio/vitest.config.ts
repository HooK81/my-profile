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
        'src/test-utils.tsx',
        'src/main.tsx',
        'src/queryClient.ts',
        'src/**/*.d.ts',
        'src/utils/console-greeting.ts',
        'src/**/__mocks__',
      ],
    },
    css: {
      modules: {
        classNameStrategy: 'non-scoped',
      },
    },
  },
});
