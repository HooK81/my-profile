import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

import pkg from './package.json' with { type: 'json' };

export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(pkg.version),
  },
  server: {
    port: 5174,
  },
  optimizeDeps: {
    include: ['my-profile-shared'],
  },
  build: {
    commonjsOptions: {
      include: [/libs\/shared/, /node_modules/],
    },
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'vendor',
              test: /node_modules/,
              minSize: 250000,
              maxSize: 500000,
            },
          ],
        },
      },
    },
  },
});
