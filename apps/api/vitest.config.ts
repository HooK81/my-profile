import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    root: './',
    exclude: ['dist/**', 'node_modules/**'],
    coverage: {
      exclude: [
        'src/config/**',
        'src/main.ts',
        'src/init/**',
        '**/const.ts',
        '**/types/**',
        '**/entities/**',
        '**/*.module.ts',
        '**/*.guard.ts',
        'dist/**',
        'tests/**',
        'test_utils/**',
        '**/.{eslint,mocha,prettier}rc.{?(c|m)js,yml}',
        '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*',
      ],
      reportsDirectory: './coverage',
    },
  },
  resolve: {
    alias: {
      // Ensure Vitest correctly resolves TypeScript path aliases
      src: resolve(import.meta.dirname, './src'),
      test_utils: resolve(import.meta.dirname, './test_utils'),
      'my-profile-shared': resolve(import.meta.dirname, '../../libs/shared/dist'),
    },
  },
});
