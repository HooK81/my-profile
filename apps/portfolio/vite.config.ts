import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

import pkg from './package.json' with { type: 'json' };

export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(pkg.version),
  },
  server: {
    port: 5173,
    // Same origin in dev too: the browser only ever sees localhost:5173, so
    // the SameSite=Strict cookie works without CORS, exactly as behind nginx.
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'vendor',
              test: /node_modules/,
              minSize: 250_000,
            },
          ],
        },
      },
    },
  },
});
