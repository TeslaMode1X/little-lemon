import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite config + Vitest (unit test) config in one place.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
    css: false,
  },
});
