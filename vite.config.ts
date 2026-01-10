import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import packageJson from './package.json' with { type: 'json' };

export default defineConfig({
  plugins: [react()],
  define: {
    __APP_VERSION__: JSON.stringify(
      (packageJson as { version: string }).version
    ),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
