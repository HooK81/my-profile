import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: 'src/index.ts',
        'fixtures/index': 'src/fixtures/index.ts',
        'fixtures/profile.fixtures': 'src/fixtures/profile.fixtures.ts',
      },
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.mjs`,
    },
    rolldownOptions: {
      external: ['zod', '@faker-js/faker', 'fishery'],
    },
  },
});
