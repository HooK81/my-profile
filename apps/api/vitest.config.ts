import { resolve } from 'path';
import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    root: './',
    coverage: {
      exclude: [
        'src/config/**',
        'src/main.ts',
        'src/cli.ts',
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
  plugins: [
    // This is required to build the test files with SWC
    swc.vite({
      // Explicitly set the module type to avoid inheriting this value from a `.swcrc` config file
      module: { type: 'es6' },
    }),
  ],
  resolve: {
    alias: {
      // Ensure Vitest correctly resolves TypeScript path aliases
      src: resolve(__dirname, './src'),
      test_utils: resolve(__dirname, './test_utils'),
      'my-profile-shared': resolve(__dirname, '../../libs/shared/dist'),
    },
  },
});
