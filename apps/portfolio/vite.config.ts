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
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: [
            'react',
            'react-dom',
            'react-router-dom',
            'react-markdown',
            'react-toastify',
          ],
          animation: ['@tsparticles/react', '@tsparticles/slim', 'typed.js'],
          intl: [
            'dayjs',
            'i18next',
            'i18next-browser-languagedetector',
            'libphonenumber-js',
            'react-i18next',
          ],
        },
      },
    },
  },
});
